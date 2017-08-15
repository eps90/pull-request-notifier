import './approval_progress_component.less';
import componentTemplate from './approval_progress_component.html';
import {ApprovalProgressController} from "./approval_progress_controller";

export class ApprovalProgressComponent implements ng.IComponentOptions {
    bindings: any = {
        reviewers: '<',
        mode: '@'
    };
    template: string = componentTemplate;

    controller = ApprovalProgressController;
}
