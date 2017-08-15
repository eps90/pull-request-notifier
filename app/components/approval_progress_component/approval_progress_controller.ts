
import {Reviewer} from "../../services/models";
import {Config} from "../../services/config";

export class ApprovalProgressController implements ng.IComponentController {
    reviewers: Reviewer[];
    mode: string;
    pullRequestProgress: string;
    reviewersCount: number;
    approvalsCount: number;
    progress: any;

    static $inject: string[] = ['Config'];

    constructor(private config: Config) {}

    $onInit = () => {
        this.reviewers = this.reviewers || [];
        this.pullRequestProgress = this.mode || this.config.getPullRequestProgress();
    };

    $doCheck = () => {
        this.updateReviewers();
    };

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
