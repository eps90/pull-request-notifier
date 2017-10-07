import componentTemplate from './pull_request_link_component.html';
import './pull_request_link_component.less';
import {PullRequestLinkController} from './pull_request_link_controller';

export class PullRequestLinkComponent implements ng.IComponentOptions {
    public template: string = componentTemplate;
    public bindings: any = {
        pr: '=',
        size: '@'
    };

    public controller = PullRequestLinkController;
}
