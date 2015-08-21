///<reference path="../../_typings.ts"/>

module BitbucketNotifier {
    export class PullRequestsListComponent implements ng.IDirective {
        restrict: string = 'E';
        templateUrl: string = '../components/pull_requests_list_component/pull_requests_list_component.html';

        constructor(private pullRequestRepository: PullRequestRepository) {}

        link = (scope: ng.IScope) => {
            scope['pullRequests'] = this.pullRequestRepository.pullRequests;
        };

        static factory(): ng.IDirectiveFactory {
            var component = (pullRequestRepository) => new PullRequestsListComponent(pullRequestRepository);
            component.$inject = ['PullRequestRepository'];
            return component;
        }
    }
}
