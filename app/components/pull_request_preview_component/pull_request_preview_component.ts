export class PullRequestPreviewComponent implements ng.IDirective {
    restrict: string = 'E';
    templateUrl: string = '../components/pull_request_preview_component/pull_request_preview_component.html';
    scope: any = {
        pr: '='
    };

    static factory(): ng.IDirectiveFactory {
        return () => new PullRequestPreviewComponent();
    }
}
