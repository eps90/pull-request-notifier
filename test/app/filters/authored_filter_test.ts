import {Config} from '../../../app/services/config';
import * as angular from 'angular';
import {PullRequest} from '../../../app/models/pull_request';
import {User} from '../../../app/models/user';

describe('AuthoredFilter', () => {
    let $filter;
    let config: Config;
    let pullRequests: PullRequest[];
    let authoredFilter;
    let loggedInUserUuid: string;

    beforeEach(angular.mock.module('bitbucketNotifier'));

    beforeEach(angular.mock.module([
        '$provide', ($provide: ng.auto.IProvideService) => {
            $provide.value('Config', {
                getUserUuid: jasmine.createSpy('getUserUuid').and.callFake(() => {
                    return loggedInUserUuid;
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
        const loggedInUser: User = new User();
        loggedInUser.uuid = 'userUuid';

        const anotherUser: User = new User();
        anotherUser.uuid = 'userUuid2';

        const authoredPullRequest: PullRequest = new PullRequest();
        authoredPullRequest.id = 101;
        authoredPullRequest.author = loggedInUser;

        const autherdPullRequestTwo: PullRequest = new PullRequest();
        autherdPullRequestTwo.id = 202;
        autherdPullRequestTwo.author = loggedInUser;

        const anotherPullRequest: PullRequest = new PullRequest();
        anotherPullRequest.id = 303;
        anotherPullRequest.author = anotherUser;

        pullRequests = [authoredPullRequest, autherdPullRequestTwo, anotherPullRequest];
        authoredFilter = $filter('authored');
    });

    it('should include only pull requests authored by logged in user', () => {
        loggedInUserUuid = 'userUuid';

        const result: PullRequest[] = authoredFilter(pullRequests);
        expect(result.length).toEqual(2);
        expect(result[0].id).toEqual(101);
        expect(result[1].id).toEqual(202);
    });

    it('should return empty set if there are no pull requests authored by a user', () => {
        loggedInUserUuid = 'jon.snow';
        expect(authoredFilter(pullRequests).length).toEqual(0);
    });
});
