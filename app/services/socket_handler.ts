// @todo TO REFACTOR!!!
// @todo Move socket handling into another service?
import {SocketManager} from './socket_manager';
import {Config} from './config';
import {Notifier} from './notifier';
import {Indicator} from './indicator';
import {PullRequestRepository} from './pull_request_repository';
import {ChromeExtensionEvent} from '../models/event/chrome_extension_event';
import {SocketClientEvent} from '../models/event/socket_client_event';
import {SocketServerEvent} from '../models/event/socket_server_event';
import {PullRequest} from '../models/pull_request';
import {PullRequestCommentEvent} from '../models/event/pull_request_comment_event';
import {PullRequestEvent} from '../models/event/pull_request_event';
import {WebhookEvent} from '../models/event/webhook_event';
import {PullRequestEventFactory} from './factory/pull_request_event_factory';
import {AnalyticsEventDispatcher} from './analytics_event_dispatcher';
import {SocketEvent} from '../models/analytics_event/socket_event';

export class SocketHandler {
    public static $inject: string[] = [
        'SocketManager',
        'Config',
        'PullRequestRepository',
        'Notifier',
        'Indicator',
        'AnalyticsEventDispatcher'
    ];
    constructor(
        private socketManager: SocketManager,
        private config: Config,
        private pullRequestRepository: PullRequestRepository,
        private notifier: Notifier,
        private indicator: Indicator,
        private analyticsEventDispatcher: AnalyticsEventDispatcher
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
            const loggedInUser = this.config.getUsername();
            this.socketManager.socket.emit(SocketClientEvent.INTRODUCE, loggedInUser);
            this.analyticsEventDispatcher.dispatch(
                SocketEvent.connected()
            );
        });

        this.socketManager.socket.on('disconnect', () => {
            this.pullRequestRepository.setPullRequests([]);
            this.indicator.reset();
            this.analyticsEventDispatcher.dispatch(
                SocketEvent.disconnected()
            );
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

            const loggedInUser = this.config.getUsername();
            this.pullRequestRepository.setPullRequests(userPrs.pullRequests);
            this.indicator.setText(this.pullRequestRepository.pullRequests.length.toString());

            for (const pr of userPrs.pullRequests) {
                for (const reviewer of pr.reviewers) {
                    if (reviewer.user.username === loggedInUser && !reviewer.approved) {
                        this.notifier.notifyNewPullRequestAssigned(pr);
                    }
                }
            }
        });

        this.socketManager.socket.on(SocketServerEvent.PULLREQUESTS_UPDATED, (userPrs: PullRequestEvent) => {
            userPrs = PullRequestEventFactory.create(userPrs);

            const loggedInUser = this.config.getUsername();

            const contextPr: PullRequest = userPrs.context;
            const sourceEvent: string = userPrs.sourceEvent;

            if (sourceEvent === WebhookEvent.PULLREQUEST_UPDATED
                && this.pullRequestRepository.hasAssignmentChanged(contextPr)
                && !this.pullRequestRepository.exists(contextPr)
            ) {
                for (const reviewer of contextPr.reviewers) {
                    if (reviewer.user.username === loggedInUser) {
                        this.notifier.notifyNewPullRequestAssigned(contextPr);
                        break;
                    }
                }
            }

            this.pullRequestRepository.setPullRequests(userPrs.pullRequests);
            this.indicator.setText(this.pullRequestRepository.pullRequests.length.toString());

            if (sourceEvent === WebhookEvent.PULLREQUEST_CREATED) {
                for (const reviewer of contextPr.reviewers) {
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
