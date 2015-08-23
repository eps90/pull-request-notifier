///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    'use strict';

    export class PullRequestRepository {
        pullRequests: Array<PullRequest> = [];

        constructor() {
            window['chrome'].extension.onMessage.addListener((message) => {
                if (message.type === ChromeExtensionEvent.PULLREQUESTS_UPDATED) {
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
