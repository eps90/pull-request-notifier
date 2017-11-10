export class NavigationBarController implements ng.IComponentController {
    public appVersion: string;

    public static $inject: string[] = ['bitbucketUrl'];

    constructor(private bitbucketUrl: string) {}

    public $onInit = () => {
        this.appVersion = 'v' + chrome.runtime.getManifest().version;
    }
}
