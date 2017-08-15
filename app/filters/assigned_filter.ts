import {Config} from '../services/config';
import {PullRequest} from '../services/models';

export function AssignedFilter(config: Config) {
    return (pullRequests: PullRequest[]) => {
        const loggedInUser = config.getUsername();
        const result: PullRequest[] = [];

        for (const pullRequest of pullRequests) {
            const reviewers = pullRequest.reviewers;
            for (const reviewer of reviewers) {
                if (reviewer.user.username === loggedInUser && result.indexOf(pullRequest) === -1) {
                    result.push(pullRequest);
                }
            }
        }

        return result;
    };
}

AssignedFilter.$inject = ['Config'];
