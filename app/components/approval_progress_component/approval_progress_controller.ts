import {Reviewer} from '../../models/reviewer';
import {Config} from '../../services/config/config';
import {ConfigObject} from '../../models/config_object';

export class ApprovalProgressController implements ng.IComponentController {
    public reviewers: Reviewer[];
    public mode: string;
    public pullRequestProgress: string;
    public reviewersCount: number;
    public approvalsCount: number;
    public progress: any;

    public static $inject: string[] = ['config'];

    constructor(private config: Config) {}

    public $onInit = () => {
        this.reviewers = this.reviewers || [];
        this.pullRequestProgress = this.mode || this.config.getItem(ConfigObject.PULLREQUEST_PROGRESS);
    }

    public $doCheck = () => {
        this.updateReviewers();
    }

    private updateReviewers(): void {
        this.reviewersCount = this.reviewers.length;
        this.approvalsCount = this.reviewers.reduce(
            (amount: number, reviewer: Reviewer) => {
                return amount + (reviewer.approved ? 1 : 0);
            },
            0
        );

        this.progress = {
            proportions: this.approvalsCount + '/' + this.reviewersCount,
            percentage: Math.floor(this.approvalsCount / this.reviewersCount * 100) + '%'
        };
    }
}
