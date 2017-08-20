import {Config} from '../../../app/services/config';
import * as angular from 'angular';
import {PullRequest} from '../../../app/models/pull_request';
import {Reviewer} from '../../../app/models/reviewer';
import {User} from '../../../app/models/user';

describe('AssignedFilter', () => {
    let $filter,
        config: Config,
        pullRequests: PullRequest[],
        assignedFilter,
        loggedInUser: string;

    beforeEach(angular.mock.module('bitbucketNotifier'));
    beforeEach(angular.mock.module([
        '$provide', ($provide: ng.auto.IProvideService) => {
            $provide.value('Config', {
                getUsername: jasmine.createSpy('getUsername').and.callFake(() => {
                    return loggedInUser;
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

        let assignedUser: User = new User();
        assignedUser.username = 'john.smith';

        let anotherAssignedUser: User = new User();
        anotherAssignedUser.username = 'anna.kowalsky';

        let loggedInReviewer: Reviewer = new Reviewer();
        loggedInReviewer.user = assignedUser;

        let nonLoggedInReviewer: Reviewer = new Reviewer();
        nonLoggedInReviewer.user = anotherAssignedUser;

        let assignedPullRequest: PullRequest = new PullRequest();
        assignedPullRequest.id = 101;
        assignedPullRequest.reviewers = [loggedInReviewer, nonLoggedInReviewer];

        let anotherAssignedPullRequest: PullRequest = new PullRequest();
        anotherAssignedPullRequest.id = 202;
        anotherAssignedPullRequest.reviewers = [loggedInReviewer];

        let notAssignedPullRequest: PullRequest = new PullRequest();
        notAssignedPullRequest.id = 303;
        notAssignedPullRequest.reviewers = [nonLoggedInReviewer];

        pullRequests = [assignedPullRequest, anotherAssignedPullRequest, notAssignedPullRequest];
    });

    it('should include only pull requests authored by logged in user', () => {
        loggedInUser = 'john.smith';

        let actual: PullRequest[] = assignedFilter(pullRequests);
        expect(actual.length).toEqual(2);
        expect(actual[0].id).toEqual(101);
        expect(actual[1].id).toEqual(202);
    });

    it('should return empty set if there are no pull requests authored by a user', () => {
        loggedInUser = 'jon.snow';
        expect(assignedFilter(pullRequests).length).toEqual(0);
    });

    it('should not return duplicates', () => {
        loggedInUser = 'john.smith';

        let assignedUser: User = new User();
        assignedUser.username = 'john.smith';

        let loggedInReviewer: Reviewer = new Reviewer();
        loggedInReviewer.user = assignedUser;

        let duplicatedReviewer: Reviewer = new Reviewer();
        duplicatedReviewer.user = assignedUser;

        let assignedPullRequest: PullRequest = new PullRequest();
        assignedPullRequest.id = 101;
        assignedPullRequest.reviewers = [loggedInReviewer, duplicatedReviewer];

        pullRequests = [assignedPullRequest];

        expect(assignedFilter(pullRequests).length).toEqual(1);
    });
});
