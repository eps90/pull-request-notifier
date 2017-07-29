import {Config} from "../../../app/services/config";
import {PullRequest, Reviewer, User} from "../../../app/services/models";
import * as angular from 'angular';

describe('AssignedFilter', () => {
    var $filter,
        config: Config,
        pullRequests: Array<PullRequest>,
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

        var assignedUser: User = new User();
        assignedUser.username = 'john.smith';

        var anotherAssignedUser: User = new User();
        anotherAssignedUser.username = 'anna.kowalsky';

        var loggedInReviewer: Reviewer = new Reviewer();
        loggedInReviewer.user = assignedUser;

        var nonLoggedInReviewer: Reviewer = new Reviewer();
        nonLoggedInReviewer.user = anotherAssignedUser;

        var assignedPullRequest: PullRequest = new PullRequest();
        assignedPullRequest.id = 101;
        assignedPullRequest.reviewers = [loggedInReviewer, nonLoggedInReviewer];

        var anotherAssignedPullRequest: PullRequest = new PullRequest();
        anotherAssignedPullRequest.id = 202;
        anotherAssignedPullRequest.reviewers = [loggedInReviewer];

        var notAssignedPullRequest: PullRequest = new PullRequest();
        notAssignedPullRequest.id = 303;
        notAssignedPullRequest.reviewers = [nonLoggedInReviewer];

        pullRequests = [assignedPullRequest, anotherAssignedPullRequest, notAssignedPullRequest];
    });

    it('should include only pull requests authored by logged in user', () => {
        loggedInUser = 'john.smith';

        var actual: Array<PullRequest> = assignedFilter(pullRequests);
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

        var assignedUser: User = new User();
        assignedUser.username = 'john.smith';

        var loggedInReviewer: Reviewer = new Reviewer();
        loggedInReviewer.user = assignedUser;

        var duplicatedReviewer: Reviewer = new Reviewer();
        duplicatedReviewer.user = assignedUser;

        var assignedPullRequest: PullRequest = new PullRequest();
        assignedPullRequest.id = 101;
        assignedPullRequest.reviewers = [loggedInReviewer, duplicatedReviewer];

        pullRequests = [assignedPullRequest];

        expect(assignedFilter(pullRequests).length).toEqual(1);
    });
});
