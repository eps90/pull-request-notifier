import {Reviewer} from "../../services/models";
import {Config} from "../../services/config";
import componentTemplate from './user_vote_component.html';
import './user_vote_component.less';

export class UserVoteComponent implements ng.IDirective {
    constructor(private config: Config) {}

    restrict: string = 'E';
    scope: any = {
        reviewers: '='
    };
    template: string = componentTemplate;

    link: ng.IDirectiveLinkFn = (scope: any) => {
        var classes = ['fa'];
        var label = '';
        for (var reviewerIdx = 0, reviewerLength = scope.reviewers.length; reviewerIdx < reviewerLength; reviewerIdx++) {
            var reviewer: Reviewer = scope.reviewers[reviewerIdx];
            if (reviewer.user.username === this.config.getUsername()) {
                if (reviewer.approved) {
                    classes.push('fa-check-circle', 'icon-approved');
                    label = 'Approved';
                } else {
                    classes.push('fa-clock-o', 'icon-waiting');
                    label = 'Waiting';
                }
                break;
            }
        }

        scope.icon = classes.join(' ');
        scope.label = label;
    };

    static factory(): ng.IDirectiveFactory {
        var directive = (config) => new UserVoteComponent(config);
        directive.$inject = ['Config'];

        return directive;
    }
}
