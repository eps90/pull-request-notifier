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
    }
}
