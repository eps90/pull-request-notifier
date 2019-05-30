import {User} from './user';
import {Project} from './project';
import {Reviewer} from './reviewer';
import {PullRequestState} from './pull_request_state';
import {PullRequestLinks} from './pull_request_links';
import * as _ from 'lodash';

export class PullRequest {
    public id: number;
    public title: string = '';
    public description: string = '';
    public author: User = new User();
    public targetRepository: Project = new Project();
    public targetBranch: string = '';
    public reviewers: Reviewer[] = [];
    public state: PullRequestState;
    public links: PullRequestLinks = new PullRequestLinks();

    public equals(otherPr: PullRequest): boolean {
        return otherPr.id === this.id
            && otherPr.targetRepository.fullName === this.targetRepository.fullName;
    }

    public getReviewersList(): string[] {
        return _.map(this.reviewers, (reviewer: Reviewer) => {
            return reviewer.user.uuid;
        });
    }

    public isMergeReady(): boolean {
        return _.filter(this.reviewers, (reviewer: Reviewer) => {
            return !reviewer.approved;
        }).length === 0;
    }
}
