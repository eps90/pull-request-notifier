///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    export class SocketHandler {
        static $inject = ['Socket', 'localStorageService', 'PullRequestRepository', 'Notifier'];
        constructor(
            private socket,
            private localStorageService: angular.local.storage.ILocalStorageService,
            private pullRequestRepository: PullRequestRepository,
            private notifier: Notifier
        ) {
            this.initListeners();
        }

        private initListeners() {
            this.socket.on('connect', () => {
                var loggedInUser = this.localStorageService.get('app:user');
                this.socket.emit('client:introduce', loggedInUser);
            });

            this.socket.on('server:pullrequests:updated', (userPrs: BitbucketNotifier.PullRequestEvent) => {
                var loggedInUser = this.localStorageService.get('app:user');

                this.pullRequestRepository.pullRequests = userPrs.pullRequests;
                var contextPr: PullRequest = userPrs.context;
                var sourceEvent: string = userPrs.sourceEvent;

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
