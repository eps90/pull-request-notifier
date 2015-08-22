///<reference path="../../../app/_typings.ts"/>

describe('AssignedFilter', () => {
    var $filter,
        config: BitbucketNotifier.Config,
        pullRequests: Array<BitbucketNotifier.PullRequest>,
        assignedFilter,
        loggedInUser: string;

    beforeEach(module('bitbucketNotifier'));
    beforeEach(module([
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

        var assignedUser: BitbucketNotifier.User = new BitbucketNotifier.User();
        assignedUser.username = 'john.smith';

        var anotherAssignedUser: BitbucketNotifier.User = new BitbucketNotifier.User();
        anotherAssignedUser.username = 'anna.kowalsky';

        var loggedInReviewer: BitbucketNotifier.Reviewer = new BitbucketNotifier.Reviewer();
        loggedInReviewer.user = assignedUser;

        var nonLoggedInReviewer: BitbucketNotifier.Reviewer = new BitbucketNotifier.Reviewer();
        nonLoggedInReviewer.user = anotherAssignedUser;

        var assignedPullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
        assignedPullRequest.id = 101;
        assignedPullRequest.reviewers = [loggedInReviewer, nonLoggedInReviewer];

        var anotherAssignedPullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
        anotherAssignedPullRequest.id = 202;
        anotherAssignedPullRequest.reviewers = [loggedInReviewer];

        var notAssignedPullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
        notAssignedPullRequest.id = 303;
        notAssignedPullRequest.reviewers = [nonLoggedInReviewer];

        pullRequests = [assignedPullRequest, anotherAssignedPullRequest, notAssignedPullRequest];
    });

    it('should include only pull requests authored by logged in user', () => {
        loggedInUser = 'john.smith';

        var actual: Array<BitbucketNotifier.PullRequest> = assignedFilter(pullRequests);
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

        var assignedUser: BitbucketNotifier.User = new BitbucketNotifier.User();
        assignedUser.username = 'john.smith';

        var loggedInReviewer: BitbucketNotifier.Reviewer = new BitbucketNotifier.Reviewer();
        loggedInReviewer.user = assignedUser;

        var duplicatedReviewer: BitbucketNotifier.Reviewer = new BitbucketNotifier.Reviewer();
        duplicatedReviewer.user = assignedUser;

        var assignedPullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
        assignedPullRequest.id = 101;
        assignedPullRequest.reviewers = [loggedInReviewer, duplicatedReviewer];

        pullRequests = [assignedPullRequest];

        expect(assignedFilter(pullRequests).length).toEqual(1);
    });
});
