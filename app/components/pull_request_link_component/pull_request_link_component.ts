///<reference path="../../_typings.ts"/>

module BitbucketNotifier {
    'use strict';

    export class PullRequestLinkComponent implements ng.IDirective {
        restrict: string = 'E';
        templateUrl: string = '../components/pull_request_link_component/pull_request_link_component.html';
        scope: any = {
            pr: '=',
            size: '@'
        };

        link: ng.IDirectiveLinkFn = (scope: ng.IScope) => {
            var prLink = scope['pr'].links.html;
            scope['size'] = scope['size'] || 'sm';

            scope['isLarge'] = () => {
                return (<string>scope['size']).toLowerCase() === 'lg';
            };

            scope['goToPullRequest'] = ($event) => {
                $event.stopPropagation();
                if ($event.which === 1) {
                    window['chrome'].tabs.create({
                        url: prLink
                    });
                }
            };
        };

        static factory(): ng.IDirectiveFactory {
            return () => new PullRequestLinkComponent();
        }
    }
}
