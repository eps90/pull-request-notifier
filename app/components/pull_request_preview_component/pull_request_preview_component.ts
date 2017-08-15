import componentTemplate from './pull_request_preview_component.html';
import './pull_request_preview_component.less';

export class PullRequestPreviewComponent implements ng.IComponentOptions {
    public template: string = componentTemplate;
    public bindings: any = {
        pr: '='
    };
}
