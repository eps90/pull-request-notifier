///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    export function AssignedFilter(config: Config) {
        return (pullRequests: Array<PullRequest>) => {
            var loggedInUser = config.getUsername();
            var result: Array<PullRequest> = [];

            for (var prIndex = 0, prsLength = pullRequests.length; prIndex < prsLength; prIndex++) {
                var pullRequest = pullRequests[prIndex];
                var reviewers = pullRequest.reviewers;
                for (var reviewerIdx = 0, reviewersLength = reviewers.length; reviewerIdx < reviewersLength; reviewerIdx++) {
                    var reviewer = reviewers[reviewerIdx];
                    if (reviewer.user.username === loggedInUser && result.indexOf(pullRequest) === -1) {
                        result.push(pullRequest);
                    }
                }
            }

            return result;
        };
    }

    AssignedFilter.$inject = ['Config'];
}
