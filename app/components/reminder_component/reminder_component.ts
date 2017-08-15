import componentTemplate from './reminder_component.html';
import './reminder_component.less';
import {ReminderController} from './reminder_controller';

export class ReminderComponent implements ng.IComponentOptions {
    public template: string = componentTemplate;
    public bindings: any = {
        pullRequest: '=',
        size: '@'
    };

    public controller = ReminderController;
}
