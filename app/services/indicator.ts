export class Indicator {
    public DEFAULT_BADGE: string = '?';

    constructor() {
        this.reset();
    }

    public setText(badgeContent: string): void {
        window['chrome'].browserAction.setBadgeText({text: badgeContent});
    }

    public reset(): void {
        window['chrome'].browserAction.setBadgeText({text: this.DEFAULT_BADGE});
    }
}
