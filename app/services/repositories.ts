///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    'use strict';

    // @todo Make event object more standarized
    export class PullRequestRepository {
        pullRequests: Array<PullRequest> = [];

        constructor() {
            window['chrome'].extension.onConnect.addListener((port) => {
                port.postMessage(this.pullRequests);
            });

            var port = window['chrome'].extension.connect({name: "Bitbucket Notifier"});
            port.onMessage.addListener((message) => {
                this.pullRequests = message;
            });

            window['chrome'].extension.onMessage.addListener((message) => {
                if (message.type === ChromeExtensionEvent.UPDATE_PULLREQUESTS) {
                    this.pullRequests = message.content;
                }
            });
        }

        setPullRequests(pullRequests:Array<PullRequest>): void {
            this.pullRequests = pullRequests;
            window['chrome'].extension.sendMessage({type: ChromeExtensionEvent.UPDATE_PULLREQUESTS, content: this.pullRequests});
        }
    }
}
