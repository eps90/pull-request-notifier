///<reference path="../../_typings.ts"/>

module BitbucketNotifier {
    'use strict';

    export class PullRequestComponent implements ng.IDirective {
        restrict: string = 'E';
        templateUrl: string = '../components/pull_request_component/pull_request_component.html';
        scope: any = {
            pullRequest: '=pr',
            mode: '@'
        };

        static factory(): ng.IDirectiveFactory {
            return () => new PullRequestComponent();
        }
    }
}
