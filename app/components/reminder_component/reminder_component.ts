///<reference path="../../_typings.ts"/>

module BitbucketNotifier {
    export class ReminderComponent implements ng.IDirective {
        restrict: string = 'E';
        templateUrl: string = '../components/reminder_component/reminder_component.html';
        scope: any = {
            pullRequest: '='
        };

        link: ng.IDirectiveLinkFn = (scope: ng.IScope, element: ng.IAugmentedJQuery) => {
            scope['remind'] = () => {
                window['chrome'].extension.sendMessage(
                    new ChromeExtensionEvent(
                        ChromeExtensionEvent.REMIND,
                        scope['pullRequest']
                    )
                );
            };
        };

        static factory(): ng.IDirectiveFactory {
            return () => new ReminderComponent();
        }
    }
}
