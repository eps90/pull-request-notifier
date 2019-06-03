import {Config} from '../../services/config';
import {Reviewer} from '../../models/reviewer';

export class UserVoteController implements ng.IComponentController {
    public icon: string;
    public label: string;
    public reviewers: Reviewer[];

    public static $inject: string[] = ['Config'];

    constructor(private config: Config) {}

    public $onInit = () => {
        const classes = ['fa'];
        let label = '';
        for (const reviewer of this.reviewers) {
            if (reviewer.user.uuid === this.config.getUserUuid()) {
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

        this.icon = classes.join(' ');
        this.label = label;
    }
}
