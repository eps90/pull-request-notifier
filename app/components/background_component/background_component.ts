///<reference path="../../_typings.ts"/>

module BitbucketNotifier {
    export class BackgroundComponent implements ng.IDirective {
        restrict: string = 'A';

        constructor(private socketHandler: SocketHandler) {}

        link: ng.IDirectiveLinkFn = () => {
            console.log('linked!');
        };

        static factory(): ng.IDirectiveFactory {
            var component = (socketHandler) => new BackgroundComponent(socketHandler);
            component.$inject = ['SocketHandler'];
            return component;
        }
    }
}
