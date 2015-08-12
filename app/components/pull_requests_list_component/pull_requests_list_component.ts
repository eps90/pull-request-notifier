///<reference path="../../_typings.ts"/>

module BitbucketNotifier {
    export class PullRequestsListComponent implements ng.IDirective {
        restrict: string = 'E';
        scope: any = {
            pullRequests: '='
        };
        templateUrl: string = '../components/pull_requests_list_component/pull_requests_list_component.html';

        static factory(): ng.IDirectiveFactory {
            return () => new PullRequestsListComponent();
        }
    }
}
