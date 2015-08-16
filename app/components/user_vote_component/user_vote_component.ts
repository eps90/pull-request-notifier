///<reference path="../../_typings.ts"/>

module BitbucketNotifier {
    export class UserVoteComponent implements ng.IDirective {
        constructor(private localStorageService: angular.local.storage.ILocalStorageService) {}

        restrict: string = 'E';
        scope = {
            reviewers: '='
        };
        templateUrl = '../components/user_vote_component/user_vote_component.html';

        link = (scope: any) => {
            var classes = ['pr-icon'];
            for (var reviewerIdx = 0, reviewerLength = scope.reviewers.length; reviewerIdx < reviewerLength; reviewerIdx++) {
                var reviewer: Reviewer = scope.reviewers[reviewerIdx];
                if (reviewer.user.username === this.localStorageService.get(ConfigObject.USER)) {
                    if (reviewer.approved) {
                        classes.push('fa-check-circle', 'icon-approved');
                    } else {
                        classes.push('fa-clock-o', 'icon-waiting');
                    }
                    break;
                }
            }

            scope.icon = classes.join(' ');
        };

        static factory() {
            var directive = (localStorageService) => new UserVoteComponent(localStorageService);
            directive.$inject = ['localStorageService'];

            return directive;
        }
    }
}
