import {PullRequest} from '../models/pull_request';
import {Config} from '../services/config/config';
import {ConfigObject} from '../models/config_object';

export function AuthoredFilter(config: Config) {
    return (pullRequests: PullRequest[]) => {
        const loggedInUser = config.getItem(ConfigObject.USER);
        const result: PullRequest[] = [];

        for (const pullRequest of pullRequests) {
            if (pullRequest.author.username === loggedInUser) {
                result.push(pullRequest);
            }
        }

        return result;
    };
}

AuthoredFilter.$inject = ['config'];
