import {Config} from '../../services/config';
import {Reviewer} from '../../models/reviewer';

export class UserVoteController implements ng.IComponentController {
    public icon: string;
    public label: string;
    public reviewers: Reviewer[];

    public static $inject: string[] = ['Config'];

    constructor(private config: Config, private $translate: angular.translate.ITranslateService) {}

    public $onInit = () => {
        const classes = ['fa'];
        let label = '';
        for (const reviewer of this.reviewers) {
            if (reviewer.user.username === this.config.getUsername()) {
                if (reviewer.approved) {
                    classes.push('fa-check-circle', 'icon-approved');
                    label = this.$translate.instant('USER_VOTE.APPROVED');
                } else {
                    classes.push('fa-clock-o', 'icon-waiting');
                    label = this.$translate.instant('USER_VOTE.WAITING');
                }
                break;
            }
        }

        this.icon = classes.join(' ');
        this.label = label;
    }
}
