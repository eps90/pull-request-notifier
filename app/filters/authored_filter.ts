///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    export function AuthoredFilter(config: Config) {
        return (pullRequests: Array<PullRequest>) => {
            var loggedInUser = config.getUsername()
            var result: Array<PullRequest> = [];

            for (var prIndex = 0, prsLength = pullRequests.length; prIndex < prsLength; prIndex++) {
                var pullRequest = pullRequests[prIndex];
                if (pullRequest.author.username === loggedInUser) {
                    result.push(pullRequest);
                }
            }

            return result;
        }
    }

    AuthoredFilter.$inject = ['Config'];
}
