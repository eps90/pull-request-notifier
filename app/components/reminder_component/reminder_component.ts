import {ChromeExtensionEvent} from "../../services/models";
import componentTemplate from './reminder_component.html';
import './reminder_component.less';

export class ReminderComponent implements ng.IDirective {
    restrict: string = 'E';
    template: string = componentTemplate;
    scope: any = {
        pullRequest: '=',
        size: '@'
    };

    link: ng.IDirectiveLinkFn = (scope: ng.IScope, element: ng.IAugmentedJQuery) => {
        scope['size'] = scope['size'] || 'sm';
        scope['disabled'] = false;

        scope['remind'] = ($event) => {
            $event.stopPropagation();
            scope['disabled'] = true;
            window['chrome'].extension.sendMessage(
                new ChromeExtensionEvent(
                    ChromeExtensionEvent.REMIND,
                    scope['pullRequest']
                )
            );
        };

        scope['isLarge'] = () => {
            return (<string>scope['size']).toLowerCase() === 'lg';
        };
    };

    static factory(): ng.IDirectiveFactory {
        return () => new ReminderComponent();
    }
}
