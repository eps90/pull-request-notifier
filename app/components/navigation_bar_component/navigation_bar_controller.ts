export class NavigationBarController implements ng.IComponentController {
    appVersion: string;

    constructor(private bitbucketUrl: string) {}

    $onInit = () => {
        this.appVersion = 'v' + window['chrome'].runtime.getManifest().version;
    }
}
