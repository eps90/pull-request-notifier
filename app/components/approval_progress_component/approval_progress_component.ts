///<reference path="../../_typings.ts"/>

module BitbucketNotifier {
    'use strict';

    export class ApprovalProgressComponent implements ng.IDirective {
        restrict: string = 'E';
        scope: any = {
            reviewers: '=',
            mode: '@'
        };
        templateUrl: string = '../components/approval_progress_component/approval_progress_component.html';

        constructor(private config: Config) {}

        link: ng.IDirectiveLinkFn = (scope: any) => {
            var reviewers: Array<Reviewer> = scope['reviewers'] || [];
            scope.pullRequestProgress = scope.mode || this.config.getPullRequestProgress();

            scope.$watch(
                () => {
                    return reviewers;
                },
                (newValue, oldValue) => {
                    newValue !== oldValue && updateReviewers()
                },
                true
            );

            function updateReviewers() {
                scope.reviewersCount = reviewers.length;
                scope.approvalsCount = reviewers.reduce(
                    (amount: number, reviewer: Reviewer) => {
                        return amount + (reviewer.approved ? 1 : 0);
                    },
                    0
                );

                scope.progress = {
                    proportions: scope.approvalsCount + '/' + scope.reviewersCount,
                    percentage: Math.floor(scope.approvalsCount / scope.reviewersCount * 100) + '%'
                };
            }

            updateReviewers();
        };

        static factory(): ng.IDirectiveFactory {
            var directive = (config) => new ApprovalProgressComponent(config);
            directive.$inject = ['Config'];
            return directive;
        }
    }
}
