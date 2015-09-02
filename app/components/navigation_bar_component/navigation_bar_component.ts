///<reference path="../../_typings.ts"/>

module BitbucketNotifier {
    export class NavigationBarComponent implements ng.IDirective {
        restrict: string = 'E';
        templateUrl: string = '../components/navigation_bar_component/navigation_bar_component.html';

        link: ng.IDirectiveLinkFn = (scope: ng.IScope) => {
            scope['appVersion'] = 'v' + window['chrome'].runtime.getManifest().version;
        };

        static factory(): ng.IDirectiveFactory {
            return () => new NavigationBarComponent();
        }
    }
}
