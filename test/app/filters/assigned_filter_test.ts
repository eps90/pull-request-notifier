import {Config} from '../../../app/services/config';
import * as angular from 'angular';
import {PullRequest} from '../../../app/models/pull_request';
import {Reviewer} from '../../../app/models/reviewer';
import {User} from '../../../app/models/user';

describe('AssignedFilter', () => {
    let $filter;
    let config: Config;
    let pullRequests: PullRequest[];
    let assignedFilter;
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
        assignedFilter = $filter('assigned');

        const assignedUser: User = new User();
        assignedUser.uuid = 'uuid';

        const anotherAssignedUser: User = new User();
        anotherAssignedUser.uuid = 'uuid2';

        const loggedInReviewer: Reviewer = new Reviewer();
        loggedInReviewer.user = assignedUser;

        const nonLoggedInReviewer: Reviewer = new Reviewer();
        nonLoggedInReviewer.user = anotherAssignedUser;

        const assignedPullRequest: PullRequest = new PullRequest();
        assignedPullRequest.id = 101;
        assignedPullRequest.reviewers = [loggedInReviewer, nonLoggedInReviewer];

        const anotherAssignedPullRequest: PullRequest = new PullRequest();
        anotherAssignedPullRequest.id = 202;
        anotherAssignedPullRequest.reviewers = [loggedInReviewer];

        const notAssignedPullRequest: PullRequest = new PullRequest();
        notAssignedPullRequest.id = 303;
        notAssignedPullRequest.reviewers = [nonLoggedInReviewer];

        pullRequests = [assignedPullRequest, anotherAssignedPullRequest, notAssignedPullRequest];
    });

    it('should include only pull requests authored by logged in user', () => {
        loggedInUserUuid = 'uuid';

        const actual: PullRequest[] = assignedFilter(pullRequests);
        expect(actual.length).toEqual(2);
        expect(actual[0].id).toEqual(101);
        expect(actual[1].id).toEqual(202);
    });

    it('should return empty set if there are no pull requests authored by a user', () => {
        loggedInUserUuid = 'jon.snow';
        expect(assignedFilter(pullRequests).length).toEqual(0);
    });

    it('should not return duplicates', () => {
        loggedInUserUuid = 'uuid';

        const assignedUser: User = new User();
        assignedUser.uuid = 'uuid';

        const loggedInReviewer: Reviewer = new Reviewer();
        loggedInReviewer.user = assignedUser;

        const duplicatedReviewer: Reviewer = new Reviewer();
        duplicatedReviewer.user = assignedUser;

        const assignedPullRequest: PullRequest = new PullRequest();
        assignedPullRequest.id = 101;
        assignedPullRequest.reviewers = [loggedInReviewer, duplicatedReviewer];

        pullRequests = [assignedPullRequest];

        expect(assignedFilter(pullRequests).length).toEqual(1);
    });
});
