///<reference path="../../../app/_typings.ts"/>

describe('AuthoredFilter', () => {
    var $filter,
        localStorageService: angular.local.storage.ILocalStorageService,
        pullRequests: Array<BitbucketNotifier.PullRequest>,
        authoredFilter;

    beforeEach(module('bitbucketNotifier'));
    beforeEach(inject([
        '$filter',
        'localStorageService',
        ($f, $l) => {
            $filter = $f;
            localStorageService = $l;
        }
    ]));

    beforeEach(() => {
        var loggedInUser: BitbucketNotifier.User = new BitbucketNotifier.User();
        loggedInUser.username = 'john.smith';

        var anotherUser: BitbucketNotifier.User = new BitbucketNotifier.User();
        anotherUser.username = 'anna.kowalsky';

        var authoredPullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
        authoredPullRequest.id = 101;
        authoredPullRequest.author = loggedInUser;

        var autherdPullRequestTwo: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
        autherdPullRequestTwo.id = 202;
        autherdPullRequestTwo.author = loggedInUser;

        var anotherPullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
        anotherPullRequest.id = 303;
        anotherPullRequest.author = anotherUser;

        pullRequests = [authoredPullRequest, autherdPullRequestTwo, anotherPullRequest];
        authoredFilter = $filter('authored');
    });

    it('should include only pull requests authored by logged in user', () => {
        localStorageService.set(BitbucketNotifier.ConfigObject.USER, 'john.smith');

        var result: Array<BitbucketNotifier.PullRequest> = authoredFilter(pullRequests);
        expect(result.length).toEqual(2);
        expect(result[0].id).toEqual(101);
        expect(result[1].id).toEqual(202);
    });

    it('should return empty set if there are no pull requests authored by a user', () => {
        localStorageService.set(BitbucketNotifier.ConfigObject.USER, 'jon.snow');
        expect(authoredFilter(pullRequests).length).toEqual(0);
    });
});
