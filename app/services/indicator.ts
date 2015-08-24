///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    'use strict';

    export class Indicator {
        DEFAULT_BADGE: string = '?';

        constructor() {
            window['chrome'].browserAction.setBadgeText({text: this.DEFAULT_BADGE});
        }

        setText(badgeContent: string): void {
            window['chrome'].browserAction.setBadgeText({text: badgeContent});
        }
    }
}
