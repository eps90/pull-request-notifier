import componentTemplate from './reminder_component.html';
import './reminder_component.less';
import {ReminderController} from "./reminder_controller";

export class ReminderComponent implements ng.IComponentOptions {
    template: string = componentTemplate;
    bindings: any = {
        pullRequest: '=',
        size: '@'
    };

    controller = ReminderController;
}
