///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    'use strict';

    // @todo Move socket handling into another service?
    export class SocketHandler {
        static $inject: Array<string> = ['Socket', 'Config', 'PullRequestRepository', 'Notifier', 'Indicator'];
        constructor(
            private socket,
            private config: Config,
            private pullRequestRepository: PullRequestRepository,
            private notifier: Notifier,
            private indicator: Indicator
        ) {
            this.initListeners();
        }

        private initListeners(): void {
            this.socket.on('connect', () => {
                var loggedInUser = this.config.getUsername();
                this.socket.emit(SocketClientEvent.INTRODUCE, loggedInUser);
            });

            this.socket.on(SocketServerEvent.INTRODUCED, (userPrs: PullRequestEvent) => {
                var loggedInUser = this.config.getUsername();
                // @todo Adapt tests
                this.pullRequestRepository.setPullRequests(userPrs.pullRequests);
                this.indicator.setText(this.pullRequestRepository.pullRequests.length.toString());

                for (var prIndex = 0, prLen = userPrs.pullRequests.length; prIndex < prLen; prIndex++) {
                    var pr = userPrs.pullRequests[prIndex];
                    for (var reviewerIdx = 0, reviewersLen = pr.reviewers.length; reviewerIdx < reviewersLen; reviewerIdx++) {
                        var reviewer = pr.reviewers[reviewerIdx];
                        if (reviewer.user.username === loggedInUser) {
                            this.notifier.notifyNewPullRequestAssigned(pr);
                        }
                    }
                }
            });

            this.socket.on(SocketServerEvent.PULLREQUESTS_UPDATED, (userPrs: BitbucketNotifier.PullRequestEvent) => {
                var loggedInUser = this.config.getUsername();

                // @todo Adapt tests
                this.pullRequestRepository.setPullRequests(userPrs.pullRequests);
                var contextPr: PullRequest = userPrs.context;
                var sourceEvent: string = userPrs.sourceEvent;
                this.indicator.setText(this.pullRequestRepository.pullRequests.length.toString());

                if (sourceEvent === WebhookEvent.PULLREQUEST_CREATED) {
                    for (var reviewerIdx = 0, reviewersLen = contextPr.reviewers.length; reviewerIdx < reviewersLen; reviewerIdx++) {
                        var reviewer = contextPr.reviewers[reviewerIdx];
                        if (reviewer.user.username === loggedInUser) {
                            this.notifier.notifyNewPullRequestAssigned(contextPr);
                            break;
                        }
                    }
                } else if (sourceEvent === WebhookEvent.PULLREQUEST_FULFILLED) {
                    if (contextPr.author.username === loggedInUser) {
                        this.notifier.notifyPullRequestMerged(contextPr);
                    }
                } else if (sourceEvent === WebhookEvent.PULLREQUEST_APPROVED) {
                    if (contextPr.author.username === loggedInUser) {
                        this.notifier.notifyPullRequestApproved(contextPr, userPrs.actor);
                    }
                }
            });
        }
    }
}
