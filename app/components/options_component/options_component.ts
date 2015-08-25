///<reference path="../../_typings.ts"/>

module BitbucketNotifier {
    'use strict';

    export class OptionsComponent implements ng.IDirective {
        restrict: string =  'E';
        templateUrl: string = '../components/options_component/options_component.html';

        constructor(private config: Config) {}

        link: ng.IDirectiveLinkFn = (scope: ng.IScope) => {
            scope['options'] = {
                appUser: this.config.getUsername(),
                socketServerAddress: this.config.getSocketServerAddress()
            };
        };

        controller = ($scope: ng.IScope) => {
            $scope['saveOptions'] = () => {
                this.config.setUsername($scope['options'].appUser);
                this.config.setSocketServerAddress($scope['options'].socketServerAddress);
            }
        };

        static factory(): ng.IDirectiveFactory {
            var component = (config) => new OptionsComponent(config);
            component.$inject = ['Config'];
            return component;
        }
    }
}
