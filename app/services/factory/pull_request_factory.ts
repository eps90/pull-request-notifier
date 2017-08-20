import {UserFactory} from './user_factory';
import {ProjectFactory} from './project_factory';
import {ReviewerFactory} from './reviewer_factory';
import {PullRequestLinksFactory} from './pull_request_links_factory';
import {PullRequestState} from '../../models/pull_request_state';
import {PullRequest} from '../../models/pull_request';

export class PullRequestFactory {
    public static create(rawObject: any): PullRequest {
        const pullRequest = new PullRequest();
        if (rawObject.hasOwnProperty('id')) {
            pullRequest.id = rawObject.id;
        }

        if (rawObject.hasOwnProperty('title')) {
            pullRequest.title = rawObject.title;
        }

        if (rawObject.hasOwnProperty('description')) {
            pullRequest.description = rawObject.description;
        }

        if (rawObject.hasOwnProperty('targetBranch')) {
            pullRequest.targetBranch = rawObject.targetBranch;
        }

        if (rawObject.hasOwnProperty('author')) {
            pullRequest.author = UserFactory.create(rawObject.author);
        }

        if (rawObject.hasOwnProperty('targetRepository')) {
            pullRequest.targetRepository = ProjectFactory.create(rawObject.targetRepository);
        }

        if (rawObject.hasOwnProperty('reviewers') && Array.isArray(rawObject.reviewers)) {
            pullRequest.reviewers = [];
            for (const reviewer of rawObject.reviewers) {
                pullRequest.reviewers.push(ReviewerFactory.create(reviewer));
            }
        }

        if (rawObject.hasOwnProperty('links')) {
            pullRequest.links = PullRequestLinksFactory.create(rawObject.links);
        }

        if (rawObject.hasOwnProperty('state')) {
            switch (rawObject.state) {
                case 0:
                    pullRequest.state = PullRequestState.Open;
                    break;
                case 1:
                    pullRequest.state = PullRequestState.Merged;
                    break;
                case 2:
                    pullRequest.state = PullRequestState.Declined;
                    break;
                default:
                    break;
            }
        }

        return pullRequest;
    }

    public static createFromArray(pullRequests: any[]): PullRequest[] {
        const result = [];
        for (const pullRequest of pullRequests) {
            result.push(this.create(pullRequest));
        }

        return result;
    }
}
