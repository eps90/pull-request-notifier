import {Config} from "../../../app/services/config";
import {PullRequest, User} from "../../../app/services/models";
import * as angular from 'angular';

describe('AuthoredFilter', () => {
    var $filter,
        config: Config,
        pullRequests: Array<PullRequest>,
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
        var loggedInUser: User = new User();
        loggedInUser.username = 'john.smith';

        var anotherUser: User = new User();
        anotherUser.username = 'anna.kowalsky';

        var authoredPullRequest: PullRequest = new PullRequest();
        authoredPullRequest.id = 101;
        authoredPullRequest.author = loggedInUser;

        var autherdPullRequestTwo: PullRequest = new PullRequest();
        autherdPullRequestTwo.id = 202;
        autherdPullRequestTwo.author = loggedInUser;

        var anotherPullRequest: PullRequest = new PullRequest();
        anotherPullRequest.id = 303;
        anotherPullRequest.author = anotherUser;

        pullRequests = [authoredPullRequest, autherdPullRequestTwo, anotherPullRequest];
        authoredFilter = $filter('authored');
    });

    it('should include only pull requests authored by logged in user', () => {
        loggedInUsername = 'john.smith';

        var result: Array<PullRequest> = authoredFilter(pullRequests);
        expect(result.length).toEqual(2);
        expect(result[0].id).toEqual(101);
        expect(result[1].id).toEqual(202);
    });

    it('should return empty set if there are no pull requests authored by a user', () => {
        loggedInUsername = 'jon.snow';
        expect(authoredFilter(pullRequests).length).toEqual(0);
    });
});
