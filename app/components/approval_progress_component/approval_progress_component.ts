///<reference path="../../_typings.ts"/>

module BitbucketNotifier {
    export class ApprovalProgressComponent implements ng.IDirective {
        restrict: string = 'E';
        scope = {
            reviewers: '='
        };
        templateUrl: string = '../components/approval_progress_component/approval_progress_component.html';

        link = (scope: any) => {
            var reviewers: Array<Reviewer> = scope['reviewers'] || [];
            scope.reviewersCount = reviewers.length;
            scope.approvalsCount = reviewers.reduce((amount:number, reviewer: Reviewer) => {
                return amount + (reviewer.approved ? 1 : 0);
            }, 0);
        };

        static factory() {
            return () => new ApprovalProgressComponent();
        }
    }
}
