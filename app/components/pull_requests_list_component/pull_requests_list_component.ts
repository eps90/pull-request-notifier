///<reference path="../../_typings.ts"/>

module BitbucketNotifier {
    'use strict';

    export class PullRequestsListComponent implements ng.IDirective {
        restrict: string = 'E';
        templateUrl: string = '../components/pull_requests_list_component/pull_requests_list_component.html';

        constructor(private pullRequestRepository: PullRequestRepository) {}

        link: ng.IDirectiveLinkFn = (scope: ng.IScope) => {
            scope['pullRequests'] = this.pullRequestRepository.pullRequests;

            scope.$watch(
                () => {
                    return this.pullRequestRepository.pullRequests;
                },
                (newValue, oldValue) => {
                    if (newValue !== oldValue) {
                        scope['pullRequests'] = newValue
                    }
                },
                true
            );
        };

        static factory(): ng.IDirectiveFactory {
            var component = (pullRequestRepository) => new PullRequestsListComponent(pullRequestRepository);
            component.$inject = ['PullRequestRepository'];
            return component;
        }
    }
}
