/// <reference path="../_typings.ts" />

module BitbucketNotifier {

    export function RoutingConfiguration(
        $stateProvider: angular.ui.IStateProvider,
        $urlRouterProvider: angular.ui.IUrlRouterProvider
    ) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: '/',
                template: '<pull-requests-list></pull-requests-list>'
            });
    }

    RoutingConfiguration.$inject = ['$stateProvider', '$urlRouterProvider'];
}
