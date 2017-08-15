export class NavigationBarController implements ng.IComponentController {
    public appVersion: string;

    constructor(private bitbucketUrl: string) {}

    public $onInit = () => {
        this.appVersion = 'v' + window['chrome'].runtime.getManifest().version;
    }
}
