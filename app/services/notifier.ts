///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    'use strict';

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
        static $inject: Array<string> = ['NotificationRepository', 'SoundManager'];

        private chrome: any;
        constructor(private notificationRepository: NotificationRepository, private soundManager: SoundManager) {
            this.chrome = window['chrome'];
            this.chrome.notifications.onClicked.addListener((notificationId) => {
                var notification = <PullRequestNotification> this.notificationRepository.find(notificationId);
                this.chrome.tabs.create({url: notification.pullRequestHtmlLink});
                this.chrome.notifications.clear(notificationId);
            });
        }

        notify(opts: NotificationOptions, notificationId: string, pullRequestLink: string): void {
            var defaultOptions: NotificationOptions = {
                type: 'basic',
                iconUrl: '../../assets/img/bitbucket_logo_raw.png',
                title: '',
                message: '',
                contextMessage: '',
                priority: 2,
                requireInteraction: true
            };
            var targetOpts: NotificationOptions = _.extend(defaultOptions, opts);
            targetOpts.message = _.trim(targetOpts.message.replace(/:[^\s:]+:/g, ''));

            this.chrome.notifications.create(notificationId, targetOpts);
            this.notificationRepository.add(notificationId, pullRequestLink);
        }

        notifyNewPullRequestAssigned(pullRequest: PullRequest): void {
            var options = {
                title: 'New pull request assigned to you!',
                message: pullRequest.title,
                contextMessage: 'by ' + pullRequest.author.displayName,
                iconUrl: '../../assets/img/bitbucket_new.png'
            };
            var notificationId = this.getNotificationId(pullRequest);

            this.notify(options, notificationId, pullRequest.links.html);
            this.soundManager.playNewPullRequestSound();
        }

        notifyPullRequestMerged(pullRequest: PullRequest): void {
            var options = {
                title: 'Your pull request has been merged',
                message: pullRequest.title,
                iconUrl: '../../assets/img/bitbucket_merged.png'
            };
            var notificationId = this.getNotificationId(pullRequest);

            this.notify(options, notificationId, pullRequest.links.html);
            this.soundManager.playMergedPullRequestSound();
        }

        notifyPullRequestApproved(pullRequest: PullRequest, actor: User): void {
            var options = {
                title: 'Your pull request has been approved',
                message: pullRequest.title,
                contextMessage: 'by ' + actor.displayName,
                iconUrl: '../../assets/img/bitbucket_approved.png'
            };
            var notificationId = this.getNotificationId(pullRequest);

            this.notify(options, notificationId, pullRequest.links.html);
            this.soundManager.playApprovedPullRequestSound();
        }

        notifyReminder(pullRequest: PullRequest): void {
            var options = {
                title: 'Someone reminds you to review a pull request',
                message: pullRequest.title,
                iconUrl: '../../assets/img/bitbucket_reminder.png'
            };
            var notificationId = this.getNotificationId(pullRequest);

            this.notify(options, notificationId, pullRequest.links.html);
            this.soundManager.playReminderSound();
        }

        notifyPullRequestUpdated(pullRequest: PullRequest): void {
            const options = {
                title: 'Pull request has been updated',
                message: pullRequest.title,
                contextMessage: 'by ' + pullRequest.author.displayName,
                iconUrl: '../../assets/img/bitbucket_updated.png'
            };
            const notificationId = this.getNotificationId(pullRequest);

            this.notify(options, notificationId, pullRequest.links.html);
        }

        notifyNewCommentAdded(pullRequest: PullRequest, commentingUser: User) {
            const options = {
                title: 'New comment on your pull request!',
                message: pullRequest.title,
                contextMessage: `by ${commentingUser.displayName}`,
                iconUrl: '../../assets/img/bitbucket_new_comment.png'
            };
            const notificationId = this.getNotificationId(pullRequest);

            this.notify(options, notificationId, pullRequest.links.html);
        }

        private getNotificationId(pullRequest: PullRequest): string {
            return _.uniqueId('pull_request_' + pullRequest.id);
        }
    }
}
