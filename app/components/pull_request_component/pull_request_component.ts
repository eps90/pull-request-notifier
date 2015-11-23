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

        constructor(private state: angular.ui.IStateService) {}

        link: ng.IDirectiveLinkFn = (scope: ng.IScope, element: ng.IAugmentedJQuery) => {
            element.on('click', () => {
                var pullRequest: PullRequest = scope['pullRequest'];
                var repositoryName = pullRequest.targetRepository.slugify();
                this.state.go('pull_request', {
                    repositoryName: repositoryName,
                    pullRequestId: pullRequest.id
                });
            });
        };

        static factory(): ng.IDirectiveFactory {
            var component = (state) => new PullRequestComponent(state);
            component.$inject = ['$state'];
            return component;
        }
    }
}
