/// <reference path="../../_typings.ts" />

module BitbucketNotifier {
    'use strict';

    export class NavigationBrandComponent {
        restrict: string = 'E';
        templateUrl: string = '../components/navigation_brand_component/navigation_brand_component.html';
        scope: any = {
            content: '@',
            icon: '@'
        };

        static factory(): ng.IDirectiveFactory {
            return () => new NavigationBrandComponent();
        }
    }
}
