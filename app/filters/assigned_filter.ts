import {Config} from '../services/config';
import {PullRequest} from '../models/pull_request';

export function AssignedFilter(config: Config) {
    return (pullRequests: PullRequest[]) => {
        const loggedInUser = config.getUserUuid();
        const result: PullRequest[] = [];

        for (const pullRequest of pullRequests) {
            const reviewers = pullRequest.reviewers;
            for (const reviewer of reviewers) {
                if (reviewer.user.uuid === loggedInUser && result.indexOf(pullRequest) === -1) {
                    result.push(pullRequest);
                }
            }
        }

        return result;
    };
}

AssignedFilter.$inject = ['Config'];
