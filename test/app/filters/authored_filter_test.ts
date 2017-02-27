///<reference path="../../../app/_typings.ts"/>

describe('AuthoredFilter', () => {
    var $filter,
        config: BitbucketNotifier.Config,
        pullRequests: Array<BitbucketNotifier.PullRequest>,
        authoredFilter,
        loggedInUsername: string;

    beforeEach(angular.mock.module('bitbucketNotifier'));

    beforeEach(angular.mock.module([
        '$provide', ($provide: ng.auto.IProvideService) => {
            $provide.value('Config', {
                getUsername: jasmine.createSpy('getUsername').and.callFake(() => {
                    return loggedInUsername;
                })
            });
        }
    ]));

    beforeEach(inject([
        '$filter',
        'Config',
        ($f, c) => {
            $filter = $f;
            config = c;
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
        loggedInUsername = 'john.smith';

        var result: Array<BitbucketNotifier.PullRequest> = authoredFilter(pullRequests);
        expect(result.length).toEqual(2);
        expect(result[0].id).toEqual(101);
        expect(result[1].id).toEqual(202);
    });

    it('should return empty set if there are no pull requests authored by a user', () => {
        loggedInUsername = 'jon.snow';
        expect(authoredFilter(pullRequests).length).toEqual(0);
    });
});
