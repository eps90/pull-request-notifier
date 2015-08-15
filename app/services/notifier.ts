///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    export class Notifier {
        private chrome;
        constructor() {
            this.chrome = window['chrome'];
        }

        notify(opts) {
            this.chrome.notifications.create(opts);
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
