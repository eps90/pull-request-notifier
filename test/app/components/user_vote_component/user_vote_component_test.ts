///<reference path="../../../../app/_typings.ts"/>

describe('UserVoteComponent', () => {
    var $scope: ng.IScope,
        $compile: ng.ICompileService,
        localStorageService: angular.local.storage.ILocalStorageService,
        pullRequest: BitbucketNotifier.PullRequest;

    beforeEach(module('bitbucketNotifier'));
    beforeEach(module('bitbucketNotifier.templates'));
    beforeEach(inject([
        '$rootScope',
        '$compile',
        'localStorageService',
        ($s, $c, $l) => {
            $scope = $s;
            $compile = $c;
            localStorageService = $l;
        }
    ]));
    beforeEach(() => {
        localStorageService.set('app:user', 'john.smith');
    });

    it('should set awaiting icon if user has not voted yet', () => {
        var loggedInUser: BitbucketNotifier.User = new BitbucketNotifier.User();
        loggedInUser.username = 'john.smith';

        var loggedInReviewer: BitbucketNotifier.Reviewer = new BitbucketNotifier.Reviewer();
        loggedInReviewer.user = loggedInUser;
        loggedInReviewer.approved = false;

        $scope['reviewers'] = [loggedInReviewer];

        var element = $compile('<user-vote reviewers="reviewers"></user-vote>')($scope);
        $scope.$digest();

        expect(element.find('.pr-icon').length).toEqual(1);
        expect(element.find('.pr-icon').hasClass('icon-waiting')).toBeTruthy();
        expect(element.find('.pr-icon').hasClass('fa-clock-o')).toBeTruthy();
    });

    it('should set approved icon if user has approved a pull request', () => {
        var loggedInUser: BitbucketNotifier.User = new BitbucketNotifier.User();
        loggedInUser.username = 'john.smith';

        var loggedInReviewer: BitbucketNotifier.Reviewer = new BitbucketNotifier.Reviewer();
        loggedInReviewer.user = loggedInUser;
        loggedInReviewer.approved = true;

        $scope['reviewers'] = [loggedInReviewer];

        var element = $compile('<user-vote reviewers="reviewers"></user-vote>')($scope);
        $scope.$digest();

        expect(element.find('.pr-icon').length).toEqual(1);
        expect(element.find('.pr-icon').hasClass('icon-approved')).toBeTruthy();
        expect(element.find('.pr-icon').hasClass('fa-check-circle')).toBeTruthy();
    });
});
