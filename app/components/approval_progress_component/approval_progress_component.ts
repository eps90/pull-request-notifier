import './approval_progress_component.less';
import componentTemplate from './approval_progress_component.html';
import {ApprovalProgressController} from './approval_progress_controller';

export class ApprovalProgressComponent implements ng.IComponentOptions {
    public bindings: any = {
        reviewers: '<',
        mode: '@'
    };
    public template: string = componentTemplate;

    public controller = ApprovalProgressController;
}
