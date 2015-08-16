///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    interface NotificationOptions {
        type?: string;
        iconUrl?: string;
        title?: string;
        message?: string;
        contextMessage?: string;
        priority?: number;
    }

    export class Notifier {
        private chrome;
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

        notify(opts: NotificationOptions, notificationId?) {
            notificationId = notificationId || _.uniqueId('pull_request_');
            var targetOpts = _.assign(this.defaultOptions, opts);
            this.chrome.notifications.create(notificationId, targetOpts);
        }

        notifyNewPullRequestAssigned(pullRequest: PullRequest) {
            var options = {
                title: 'New pull request assigned to you!',
                message: pullRequest.title,
                contextMessage: 'by ' + pullRequest.author.displayName
            };

            this.notify(options);
        }

        notifyPullRequestMerged(pullRequest: PullRequest) {
            var options = {
                title: 'Your pull request has been merged',
                message: pullRequest.title
            };

            this.notify(options);
        }
    }
}
