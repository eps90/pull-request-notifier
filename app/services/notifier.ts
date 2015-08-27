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
    }

    export class Notifier {
        static $inject: Array<string> = ['NotificationRepository'];

        private chrome: any;
        private defaultOptions: NotificationOptions = {
            type: 'basic',
            iconUrl: '../../assets/img/bitbucket_logo_raster.jpg',
            title: '',
            message: '',
            contextMessage: '',
            priority: 2
        };

        constructor(private notificationRepository: NotificationRepository) {
            this.chrome = window['chrome'];
        }

        notify(opts: NotificationOptions, notificationId: string): void {
            var targetOpts = _.assign(this.defaultOptions, opts);
            this.chrome.notifications.create(notificationId, targetOpts);
        }

        notifyNewPullRequestAssigned(pullRequest: PullRequest): void {
            var options = {
                title: 'New pull request assigned to you!',
                message: pullRequest.title,
                contextMessage: 'by ' + pullRequest.author.displayName,
                iconUrl: '../../assets/img/bitbucket_new.png'
            };
            var notificationId = this.getNotificationId(pullRequest);

            this.notify(options, notificationId);
        }

        notifyPullRequestMerged(pullRequest: PullRequest): void {
            var options = {
                title: 'Your pull request has been merged',
                message: pullRequest.title,
                iconUrl: '../../assets/img/bitbucket_merged.png'
            };
            var notificationId = this.getNotificationId(pullRequest);

            this.notify(options, notificationId);
        }

        notifyPullRequestApproved(pullRequest: PullRequest, actor: User): void {
            var options = {
                title: 'Your pull request has been approved',
                message: pullRequest.title,
                contextMessage: 'by ' + actor.displayName
            };
            var notificationId = this.getNotificationId(pullRequest);

            this.notify(options, notificationId);
        }

        private getNotificationId(pullRequest: PullRequest) {
            return _.uniqueId('pull_request_');
        }
    }
}
