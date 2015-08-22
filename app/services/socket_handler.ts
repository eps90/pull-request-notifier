///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    'use strict';

    export class SocketHandler {
        static $inject: Array<String> = ['Socket', 'Config', 'PullRequestRepository', 'Notifier'];
        constructor(
            private socket,
            private config: Config,
            private pullRequestRepository: PullRequestRepository,
            private notifier: Notifier
        ) {
            this.initListeners();
        }

        private initListeners(): void {
            this.socket.on('connect', () => {
                var loggedInUser = this.config.getUsername();
                this.socket.emit(SocketClientEvent.INTRODUCE, loggedInUser);
            });

            this.socket.on(SocketServerEvent.PULLREQUESTS_UPDATED, (userPrs: BitbucketNotifier.PullRequestEvent) => {
                var loggedInUser = this.config.getUsername();

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
