import {NotificationRepository} from './notification_repository';
import {SoundManager} from './sound_manager';
import {PullRequest, PullRequestNotification, User} from './models';
import * as _ from 'lodash';

interface NotificationOptions {
    type?: string;
    iconUrl?: string;
    title?: string;
    message?: string;
    contextMessage?: string;
    priority?: number;
    requireInteraction?: boolean;
}

export class Notifier {
    public static $inject: string[] = ['NotificationRepository', 'SoundManager'];

    private chrome: any;
    constructor(private notificationRepository: NotificationRepository, private soundManager: SoundManager) {
        this.chrome = window['chrome'];
        this.chrome.notifications.onClicked.addListener((notificationId) => {
            const notification = <PullRequestNotification> this.notificationRepository.find(notificationId);
            this.chrome.tabs.create({url: notification.pullRequestHtmlLink});
            this.chrome.notifications.clear(notificationId);
        });
    }

    public notify(opts: NotificationOptions, notificationId: string, pullRequestLink: string): void {
        const defaultOptions: NotificationOptions = {
            type: 'basic',
            iconUrl: '../../assets/img/bitbucket_logo_raw.png',
            title: '',
            message: '',
            contextMessage: '',
            priority: 2,
            requireInteraction: true
        };
        const targetOpts: NotificationOptions = _.extend(defaultOptions, opts);
        targetOpts.message = _.trim(targetOpts.message.replace(/:[^\s:]+:/g, ''));

        this.chrome.notifications.create(notificationId, targetOpts);
        this.notificationRepository.add(notificationId, pullRequestLink);
    }

    public notifyNewPullRequestAssigned(pullRequest: PullRequest): void {
        const options = {
            title: 'New pull request assigned to you!',
            message: pullRequest.title,
            contextMessage: 'by ' + pullRequest.author.displayName,
            iconUrl: '../../assets/img/bitbucket_new.png'
        };
        const notificationId = this.getNotificationId(pullRequest);

        this.notify(options, notificationId, pullRequest.links.html);
        this.soundManager.playNewPullRequestSound();
    }

    public notifyPullRequestMerged(pullRequest: PullRequest): void {
        const options = {
            title: 'Your pull request has been merged',
            message: pullRequest.title,
            iconUrl: '../../assets/img/bitbucket_merged.png'
        };
        const notificationId = this.getNotificationId(pullRequest);

        this.notify(options, notificationId, pullRequest.links.html);
        this.soundManager.playMergedPullRequestSound();
    }

    public notifyPullRequestApproved(pullRequest: PullRequest, actor: User): void {
        const options = {
            title: 'Your pull request has been approved',
            message: pullRequest.title,
            contextMessage: 'by ' + actor.displayName,
            iconUrl: '../../assets/img/bitbucket_approved.png'
        };
        const notificationId = this.getNotificationId(pullRequest);

        this.notify(options, notificationId, pullRequest.links.html);
        this.soundManager.playApprovedPullRequestSound();
    }

    public notifyReminder(pullRequest: PullRequest): void {
        const options = {
            title: 'Someone reminds you to review a pull request',
            message: pullRequest.title,
            iconUrl: '../../assets/img/bitbucket_reminder.png'
        };
        const notificationId = this.getNotificationId(pullRequest);

        this.notify(options, notificationId, pullRequest.links.html);
        this.soundManager.playReminderSound();
    }

    public notifyPullRequestUpdated(pullRequest: PullRequest): void {
        const options = {
            title: 'Pull request has been updated',
            message: pullRequest.title,
            contextMessage: 'by ' + pullRequest.author.displayName,
            iconUrl: '../../assets/img/bitbucket_updated.png'
        };
        const notificationId = this.getNotificationId(pullRequest);

        this.notify(options, notificationId, pullRequest.links.html);
    }

    public notifyNewCommentAdded(pullRequest: PullRequest, commentingUser: User, commentLink: string): void {
        const options = {
            title: 'New comment on your pull request!',
            message: pullRequest.title,
            contextMessage: `by ${commentingUser.displayName}`,
            iconUrl: '../../assets/img/bitbucket_new_comment.png'
        };
        const notificationId = this.getNotificationId(pullRequest);

        this.notify(options, notificationId, commentLink);
    }

    public notifyNewReplyOnComment(pullRequest: PullRequest, replyingUser: User, commentLink: string): void {
        const options = {
            title: 'New reply for your comment',
            message: pullRequest.title,
            contextMessage: `by ${replyingUser.displayName}`,
            iconUrl: '../../assets/img/bitbucket_new_reply.png'
        };
        const notificationId = this.getNotificationId(pullRequest);

        this.notify(options, notificationId, commentLink);
    }

    private getNotificationId(pullRequest: PullRequest): string {
        return _.uniqueId('pull_request_' + pullRequest.id);
    }
}
