import {Config} from '../services/config';
import {PullRequest} from '../models/pull_request';

export function AuthoredFilter(config: Config) {
    return (pullRequests: PullRequest[]) => {
        const loggedInUser = config.getUserUuid();
        const result: PullRequest[] = [];

        for (const pullRequest of pullRequests) {
            if (pullRequest.author.uuid === loggedInUser) {
                result.push(pullRequest);
            }
        }

        return result;
    };
}

AuthoredFilter.$inject = ['Config'];
