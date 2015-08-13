///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    export function AuthoredFilter(localStorageService: angular.local.storage.ILocalStorageService) {
        this.$inject = ['localStorageService'];

        return (pullRequests: Array<PullRequest>) => {
            var loggedInUser = localStorageService.get('app:user');
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
}
