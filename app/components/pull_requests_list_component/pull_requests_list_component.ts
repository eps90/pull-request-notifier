import componentTemplate from './pull_requests_list_component.html';
import './pull_requests_list_component.less';
import {PullRequestsListController} from "./pull_requests_list_controller";

export class PullRequestsListComponent implements ng.IComponentOptions {
    template: string = componentTemplate;

    controller = PullRequestsListController;
}
