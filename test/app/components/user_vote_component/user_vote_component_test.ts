///<reference path="../../../../app/_typings.ts"/>

describe('UserVoteComponent', () => {
    var $scope: ng.IScope,
        $compile: ng.ICompileService,
        config: BitbucketNotifier.Config;

    beforeEach(angular.mock.module('bitbucketNotifier'));
    beforeEach(angular.mock.module('bitbucketNotifier.templates'));

    beforeEach(angular.mock.module([
        '$provide', ($provide: ng.auto.IProvideService) => {
            $provide.value('Config', {
                getUsername: jasmine.createSpy('getUsername').and.callFake(() => {
                    return 'john.smith';
                })
            });
        }
    ]));

    beforeEach(inject([
        '$rootScope',
        '$compile',
        'Config',
        ($s, $c, c) => {
            $scope = $s;
            $compile = $c;
            config = c;
        }
    ]));

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
