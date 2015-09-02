///<reference path="../../_typings.ts"/>

module BitbucketNotifier {
    'use strict';

    export class NavigationBarComponent implements ng.IDirective {
        restrict: string = 'E';
        templateUrl: string = '../components/navigation_bar_component/navigation_bar_component.html';

        constructor(private bitbucketUrl: string) {}

        link: ng.IDirectiveLinkFn = (scope: ng.IScope) => {
            scope['appVersion'] = 'v' + window['chrome'].runtime.getManifest().version;
            scope['goToBitbucket'] = () => {
                window['chrome'].tabs.create({url: this.bitbucketUrl});
            };
        };

        static factory(): ng.IDirectiveFactory {
            var component = (bitbucketUrl) => new NavigationBarComponent(bitbucketUrl);
            component.$inject = ['bitbucketUrl'];
            return component;
        }
    }
}
