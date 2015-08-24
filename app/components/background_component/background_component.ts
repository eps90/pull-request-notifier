///<reference path="../../_typings.ts"/>

module BitbucketNotifier {
    'use strict';

    export class BackgroundComponent implements ng.IDirective {
        restrict: string = 'A';

        constructor(private socketHandler: SocketHandler, private indicator: Indicator) {}

        static factory(): ng.IDirectiveFactory {
            var component = (socketHandler, indicator) => new BackgroundComponent(socketHandler, indicator);
            component.$inject = ['SocketHandler', 'Indicator'];
            return component;
        }
    }
}
