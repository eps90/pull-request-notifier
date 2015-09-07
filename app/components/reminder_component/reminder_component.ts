///<reference path="../../_typings.ts"/>

module BitbucketNotifier {
    export class ReminderComponent implements ng.IDirective {
        restrict: string = 'E';
        templateUrl: string = '../components/reminder_component/reminder_component.html';
        scope: any = {
            pullRequest: '='
        };

        link: ng.IDirectiveLinkFn = (scope: ng.IScope) => {

        };

        static factory(): ng.IDirectiveFactory {
            return () => new ReminderComponent();
        }
    }
}
