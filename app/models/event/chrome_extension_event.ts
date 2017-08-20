export class ChromeExtensionEvent {
    public type: string = '';
    public content: any;

    public static UPDATE_PULLREQUESTS: string = 'backend:update_pullrequests';
    public static REMIND: string = 'backend:remind';

    constructor(type: string, content: any = {}) {
        this.type = type;
        this.content = content;
    }

    public static isBackground(): boolean {
        return window.location.href.match(/background\.html/) !== null;
    }
}
