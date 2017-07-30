import componentTemplate from './navigation_bar_component.html';

export class NavigationBarComponent implements ng.IDirective {
    restrict: string = 'E';
    template: string = componentTemplate;

    constructor(private bitbucketUrl: string) {}

    link: ng.IDirectiveLinkFn = (scope: ng.IScope) => {
        scope['appVersion'] = 'v' + window['chrome'].runtime.getManifest().version;

    };

    static factory(): ng.IDirectiveFactory {
        var component = (bitbucketUrl) => new NavigationBarComponent(bitbucketUrl);
        component.$inject = ['bitbucketUrl'];
        return component;
    }
}
