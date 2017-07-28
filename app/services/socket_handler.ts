// @todo TO REFACTOR!!!
// @todo Move socket handling into another service?
export class SocketHandler {
    static $inject: Array<string> = ['SocketManager', 'Config', 'PullRequestRepository', 'Notifier', 'Indicator'];
    constructor(
        private socketManager: BitbucketNotifier.SocketManager,
        private config: Config,
        private pullRequestRepository: PullRequestRepository,
        private notifier: Notifier,
        private indicator: Indicator
    ) {
        this.initListeners();
        this.initChromeEvents();
    }

    private initChromeEvents(): void {
        window['chrome'].extension.onMessage.addListener((event: ChromeExtensionEvent) => {
            if (event.type === ChromeExtensionEvent.REMIND) {
                this.socketManager.socket.emit(SocketClientEvent.REMIND, event.content);
            }
        });
    }

    private initListeners(): void {
        this.socketManager.socket.on('connect', () => {
            var loggedInUser = this.config.getUsername();
            this.socketManager.socket.emit(SocketClientEvent.INTRODUCE, loggedInUser);
        });

        this.socketManager.socket.on('disconnect', () => {
            this.pullRequestRepository.setPullRequests([]);
            this.indicator.reset();
        });

        this.socketManager.socket.on(SocketServerEvent.REMIND, (pullRequest: PullRequest) => {
            this.notifier.notifyReminder(pullRequest);
        });

        this.socketManager.socket.on(SocketServerEvent.PULLREQUEST_UPDATED, (pullRequest: PullRequest) => {
            this.notifier.notifyPullRequestUpdated(pullRequest);
        });

        this.socketManager.socket.on(SocketServerEvent.NEW_COMMENT, (prEvent: PullRequestCommentEvent) => {
            if (prEvent.pullRequest.author.username !== prEvent.actor.username) {
                const commentLink = prEvent.comment.links.html.href;
                this.notifier.notifyNewCommentAdded(prEvent.pullRequest, prEvent.actor, commentLink);
            }
        });

        this.socketManager.socket.on(SocketServerEvent.NEW_REPLY_FOR_COMMENT, (prEvent: PullRequestCommentEvent) => {
            const commentLink = prEvent.comment.links.html.href;
            this.notifier.notifyNewReplyOnComment(prEvent.pullRequest, prEvent.actor, commentLink);
        });

        this.socketManager.socket.on(SocketServerEvent.INTRODUCED, (userPrs: PullRequestEvent) => {
            userPrs = PullRequestEventFactory.create(userPrs);

            var loggedInUser = this.config.getUsername();
            this.pullRequestRepository.setPullRequests(userPrs.pullRequests);
            this.indicator.setText(this.pullRequestRepository.pullRequests.length.toString());

            for (var prIndex = 0, prLen = userPrs.pullRequests.length; prIndex < prLen; prIndex++) {
                var pr = userPrs.pullRequests[prIndex];
                for (var reviewerIdx = 0, reviewersLen = pr.reviewers.length; reviewerIdx < reviewersLen; reviewerIdx++) {
                    var reviewer = pr.reviewers[reviewerIdx];
                    if (reviewer.user.username === loggedInUser && !reviewer.approved) {
                        this.notifier.notifyNewPullRequestAssigned(pr);
                    }
                }
            }
        });

        this.socketManager.socket.on(SocketServerEvent.PULLREQUESTS_UPDATED, (userPrs: PullRequestEvent) => {
            userPrs = PullRequestEventFactory.create(userPrs);

            var loggedInUser = this.config.getUsername();

            var contextPr: PullRequest = userPrs.context;
            var sourceEvent: string = userPrs.sourceEvent;

            if (sourceEvent === WebhookEvent.PULLREQUEST_UPDATED
                && this.pullRequestRepository.hasAssignmentChanged(contextPr)
                && !this.pullRequestRepository.exists(contextPr)
            ) {
                for (let reviewerIdx = 0, reviewersLen = contextPr.reviewers.length; reviewerIdx < reviewersLen; reviewerIdx++) {
                    let reviewer = contextPr.reviewers[reviewerIdx];
                    if (reviewer.user.username === loggedInUser) {
                        this.notifier.notifyNewPullRequestAssigned(contextPr);
                        break;
                    }
                }
            }

            this.pullRequestRepository.setPullRequests(userPrs.pullRequests);
            this.indicator.setText(this.pullRequestRepository.pullRequests.length.toString());

            if (sourceEvent === WebhookEvent.PULLREQUEST_CREATED) {
                for (let reviewerIdx = 0, reviewersLen = contextPr.reviewers.length; reviewerIdx < reviewersLen; reviewerIdx++) {
                    let reviewer = contextPr.reviewers[reviewerIdx];
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
