export class ReminderComponent implements ng.IDirective {
    restrict: string = 'E';
    templateUrl: string = '../components/reminder_component/reminder_component.html';
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
