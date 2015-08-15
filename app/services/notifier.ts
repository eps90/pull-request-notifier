///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    export class Notifier {
        private chrome;
        private defaultOptions = {
            type: 'basic',
            iconUrl: '../../assets/img/bitbucket_logo_raster.jpg',
            title: '',
            message: '',
            priority: 2
        };

        constructor() {
            this.chrome = window['chrome'];
        }

        notify(opts) {
            var targetOpts = _.assign(this.defaultOptions, opts);
            this.chrome.notifications.create(targetOpts);
        }

        notifyNewPullRequestAssigned(pullRequest: PullRequest) {
            var options = {
                title: 'New pull request assigned to you!',
                message: pullRequest.title
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
