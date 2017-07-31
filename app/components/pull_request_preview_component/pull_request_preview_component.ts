import componentTemplate from './pull_request_preview_component.html';
import './pull_request_preview_component.less';

export class PullRequestPreviewComponent implements ng.IDirective {
    restrict: string = 'E';
    template: string = componentTemplate;
    scope: any = {
        pr: '='
    };

    static factory(): ng.IDirectiveFactory {
        return () => new PullRequestPreviewComponent();
    }
}
