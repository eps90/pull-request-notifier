// @todo Move event handling to some "Chrome events handler/emitter"
export class PullRequestRepository {
    static $inject: Array<string> = ['$rootScope'];

    pullRequests: Array<PullRequest> = [];

    constructor(private $rootScope: ng.IRootScopeService) {
        window['chrome'].extension.onConnect.addListener((port) => {
            port.postMessage(new ChromeExtensionEvent(ChromeExtensionEvent.UPDATE_PULLREQUESTS, this.pullRequests));
        });

        var port = window['chrome'].extension.connect({name: "Bitbucket Notifier"});
        port.onMessage.addListener((message: ChromeExtensionEvent) => {
            this.$rootScope.$apply(() => {
                this.pullRequests = PullRequestFactory.createFromArray(message.content);
            });
        });

        window['chrome'].extension.onMessage.addListener((message: ChromeExtensionEvent) => {
            if (message.type === ChromeExtensionEvent.UPDATE_PULLREQUESTS && !ChromeExtensionEvent.isBackground()) {
                $rootScope.$apply(() => {
                    this.pullRequests = PullRequestFactory.createFromArray(message.content);
                });
            }
        });
    }

    setPullRequests(pullRequests: Array<PullRequest>): void {
        this.pullRequests = pullRequests;
        window['chrome'].extension.sendMessage(
            new ChromeExtensionEvent(
                ChromeExtensionEvent.UPDATE_PULLREQUESTS,
                this.pullRequests
            )
        );
    }

    hasAssignmentChanged(newPullRequest: PullRequest): boolean {
        for (var prIdx = 0, prLen = this.pullRequests.length; prIdx < prLen; prIdx++) {
            var pullRequest = this.pullRequests[prIdx];
            if (pullRequest.equals(newPullRequest)) {
                if (newPullRequest.reviewers.length !== pullRequest.reviewers.length) {
                    return true;
                } else {
                    var usersDiff = _.difference(
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

    find(repositoryName: string, pullRequestId: number): PullRequest {
        for (let prIdx = 0, len = this.pullRequests.length; prIdx < len; prIdx++) {
            var pullRequest = this.pullRequests[prIdx];
            if (pullRequest.id === pullRequestId && pullRequest.targetRepository.fullName === repositoryName) {
                return pullRequest;
            }
        }

        return null;
    }

    exists(pullRequest: PullRequest): boolean {
        return this.find(pullRequest.targetRepository.fullName, pullRequest.id) !== null;
    }
}
