///<reference path="../../_typings.ts"/>

module BitbucketNotifier {
    'use strict';

    export class OptionsComponent implements ng.IDirective {
        restrict: string =  'E';
        templateUrl: string = '../components/options_component/options_component.html';

        constructor(private config: Config) {}

        static factory(): ng.IDirectiveFactory {
            var component = (config) => new OptionsComponent(config);
            component.$inject = ['Config'];
            return component;
        }
    }
}
