import componentTemplate from './pull_request_link_component.html';
import './pull_request_link_component.less';
import {PullRequestLinkController} from "./pull_request_link_controller";

export class PullRequestLinkComponent implements ng.IComponentOptions {
    template: string = componentTemplate;
    bindings: any = {
        pr: '=',
        size: '@'
    };

    controller = PullRequestLinkController;
}
