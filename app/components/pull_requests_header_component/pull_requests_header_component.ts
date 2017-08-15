import componentTemplate from './pull_requests_header_component.html';
import './pull_requests_header_component.less';

export class PullRequestsHeaderComponent implements ng.IComponentOptions {
    public template: string = componentTemplate;
    public bindings: any = {
        mode: '@'
    };
}
