import {Config} from "../services/config";
import {PullRequest} from "../services/models";

export function AuthoredFilter(config: Config): Function {
    return (pullRequests: Array<PullRequest>) => {
        var loggedInUser = config.getUsername();
        var result: Array<PullRequest> = [];

        for (var prIndex = 0, prsLength = pullRequests.length; prIndex < prsLength; prIndex++) {
            var pullRequest = pullRequests[prIndex];
            if (pullRequest.author.username === loggedInUser) {
                result.push(pullRequest);
            }
        }

        return result;
    };
}

AuthoredFilter.$inject = ['Config'];
