///<reference path="../../_typings.ts"/>

module BitbucketNotifier {
    export class PullRequestsHeaderComponent implements ng.IDirective {
        restrict =  'E';
        templateUrl = '../components/pull_requests_header_component/pull_requests_header_component.html';
        scope = {
            mode: '@'
        };

        static factory() : ng.IDirectiveFactory {
            return () => new PullRequestsHeaderComponent();
        }
    }
}
