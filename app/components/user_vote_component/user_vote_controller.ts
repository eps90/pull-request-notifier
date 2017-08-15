import {Config} from "../../services/config";
import {Reviewer} from "../../services/models";

export class UserVoteController implements ng.IComponentController {
    static $inject: string[] = ['Config'];

    icon: string;
    label: string;
    reviewers: Reviewer[];

    constructor(private config: Config) {}

    $onInit = () => {
        const classes = ['fa'];
        let label = '';
        for (let reviewer of this.reviewers) {
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

        this.icon = classes.join(' ');
        this.label = label;
    };
}
