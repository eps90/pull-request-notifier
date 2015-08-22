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
        private chrome: any;
        private defaultOptions: NotificationOptions = {
            type: 'basic',
            iconUrl: '../../assets/img/bitbucket_logo_raster.jpg',
            title: '',
            message: '',
            contextMessage: '',
            priority: 2
        };

        constructor() {
            this.chrome = window['chrome'];
        }

        notify(opts: NotificationOptions, notificationId?): void {
            notificationId = notificationId || _.uniqueId('pull_request_');
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

            this.notify(options);
        }

        notifyPullRequestMerged(pullRequest: PullRequest): void {
            var options = {
                title: 'Your pull request has been merged',
                message: pullRequest.title,
                iconUrl: '../../assets/img/bitbucket_merged.png'
            };

            this.notify(options);
        }

        notifyPullRequestApproved(pullRequest: PullRequest, actor: User): void {
            var options = {
                title: 'Your pull request has been approved',
                message: pullRequest.title,
                contextMessage: 'by ' + actor.displayName
            };

            this.notify(options);
        }
    }
}
