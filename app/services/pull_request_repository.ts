// @todo Move event handling to some "Chrome events handler/emitter"
import * as _ from 'lodash';
import {PullRequest} from '../models/pull_request';
import {ChromeExtensionEvent} from '../models/event/chrome_extension_event';
import {PullRequestFactory} from './factory/pull_request_factory';

export class PullRequestRepository {
    public pullRequests: PullRequest[] = [];

    public static $inject: string[] = ['$rootScope'];

    constructor(private $rootScope: ng.IRootScopeService) {
        chrome.runtime.onConnect.addListener((chromePort) => {
            chromePort.postMessage(
                new ChromeExtensionEvent(ChromeExtensionEvent.UPDATE_PULLREQUESTS, this.pullRequests)
            );
        });

        const port = chrome.runtime.connect({name: 'Bitbucket Notifier'});
        port.onMessage.addListener((message: ChromeExtensionEvent) => {
            this.$rootScope.$apply(() => {
                this.pullRequests = PullRequestFactory.createFromArray(message.content);
            });
        });

        chrome.runtime.onMessage.addListener((message: ChromeExtensionEvent) => {
            if (message.type === ChromeExtensionEvent.UPDATE_PULLREQUESTS && !ChromeExtensionEvent.isBackground()) {
                $rootScope.$apply(() => {
                    this.pullRequests = PullRequestFactory.createFromArray(message.content);
                });
            }
        });
    }

    public setPullRequests(pullRequests: PullRequest[]): void {
        this.pullRequests = pullRequests;
        chrome.runtime.sendMessage(
            new ChromeExtensionEvent(
                ChromeExtensionEvent.UPDATE_PULLREQUESTS,
                this.pullRequests
            )
        );
    }

    public hasAssignmentChanged(newPullRequest: PullRequest): boolean {
        for (const pullRequest of this.pullRequests) {
            if (pullRequest.equals(newPullRequest)) {
                if (newPullRequest.reviewers.length !== pullRequest.reviewers.length) {
                    return true;
                } else {
                    const usersDiff = _.difference(
                        newPullRequest.getReviewersList(),
                        pullRequest.getReviewersList()
                    );

                    if (usersDiff.length > 0) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    public find(repositoryName: string, pullRequestId: number): PullRequest {
        for (const pullRequest of this.pullRequests) {
            if (pullRequest.id === pullRequestId && pullRequest.targetRepository.fullName === repositoryName) {
                return pullRequest;
            }
        }

        return null;
    }

    public exists(pullRequest: PullRequest): boolean {
        return this.find(pullRequest.targetRepository.fullName, pullRequest.id) !== null;
    }
}
