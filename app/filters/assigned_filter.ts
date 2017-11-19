import {PullRequest} from '../models/pull_request';
import {Config} from '../services/config/config';
import {ConfigObject} from '../models/config_object';

export function AssignedFilter(config: Config) {
    return (pullRequests: PullRequest[]) => {
        const loggedInUser = config.getItem(ConfigObject.USER);
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

AssignedFilter.$inject = ['config'];
