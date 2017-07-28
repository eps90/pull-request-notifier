export class PullRequestsHeaderComponent implements ng.IDirective {
    restrict: string =  'E';
    templateUrl: string = '../components/pull_requests_header_component/pull_requests_header_component.html';
    scope: any = {
        mode: '@'
    };

    static factory(): ng.IDirectiveFactory {
        return () => new PullRequestsHeaderComponent();
    }
}
