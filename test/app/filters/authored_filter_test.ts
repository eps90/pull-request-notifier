import {Config} from '../../../app/services/config';
import * as angular from 'angular';
import {PullRequest} from '../../../app/models/pull_request';
import {User} from '../../../app/models/user';

describe('AuthoredFilter', () => {
    let $filter,
        config: Config,
        pullRequests: PullRequest[],
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
        let loggedInUser: User = new User();
        loggedInUser.username = 'john.smith';

        let anotherUser: User = new User();
        anotherUser.username = 'anna.kowalsky';

        let authoredPullRequest: PullRequest = new PullRequest();
        authoredPullRequest.id = 101;
        authoredPullRequest.author = loggedInUser;

        let autherdPullRequestTwo: PullRequest = new PullRequest();
        autherdPullRequestTwo.id = 202;
        autherdPullRequestTwo.author = loggedInUser;

        let anotherPullRequest: PullRequest = new PullRequest();
        anotherPullRequest.id = 303;
        anotherPullRequest.author = anotherUser;

        pullRequests = [authoredPullRequest, autherdPullRequestTwo, anotherPullRequest];
        authoredFilter = $filter('authored');
    });

    it('should include only pull requests authored by logged in user', () => {
        loggedInUsername = 'john.smith';

        let result: PullRequest[] = authoredFilter(pullRequests);
        expect(result.length).toEqual(2);
        expect(result[0].id).toEqual(101);
        expect(result[1].id).toEqual(202);
    });

    it('should return empty set if there are no pull requests authored by a user', () => {
        loggedInUsername = 'jon.snow';
        expect(authoredFilter(pullRequests).length).toEqual(0);
    });
});
