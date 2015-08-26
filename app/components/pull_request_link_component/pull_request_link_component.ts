///<reference path="../../_typings.ts"/>

module BitbucketNotifier {
    export class PullRequestLinkComponent implements ng.IDirective {
        restrict: string = 'E';
        templateUrl: string = '../components/pull_request_link_component/pull_request_link_component.html';
        scope: any = {
            pr: '='
        };

        link: ng.IDirectiveLinkFn = (scope: ng.IScope) => {
            var prLink = scope['pr'].links.html;
            scope['_link'] = prLink
        };

        static factory(): ng.IDirectiveFactory {
            return () => new PullRequestLinkComponent();
        }
    }
}
