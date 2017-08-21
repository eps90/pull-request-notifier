import {Config} from '../../../../app/services/config';
import * as angular from 'angular';
import {User} from '../../../../app/models/user';
import {Reviewer} from '../../../../app/models/reviewer';

describe('UserVoteComponent', () => {
    let $scope: ng.IScope;
    let $compile: ng.ICompileService;
    let config: Config;

    beforeEach(angular.mock.module('bitbucketNotifier'));
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
        const loggedInUser: User = new User();
        loggedInUser.username = 'john.smith';

        const loggedInReviewer: Reviewer = new Reviewer();
        loggedInReviewer.user = loggedInUser;
        loggedInReviewer.approved = false;

        $scope['reviewers'] = [loggedInReviewer];

        const element = $compile('<user-vote reviewers="reviewers"></user-vote>')($scope);
        $scope.$digest();

        expect(element.find('.pr-icon').length).toEqual(1);
        expect(element.find('.pr-icon').hasClass('icon-waiting')).toBeTruthy();
        expect(element.find('.pr-icon').hasClass('fa-clock-o')).toBeTruthy();
    });

    it('should set approved icon if user has approved a pull request', () => {
        const loggedInUser: User = new User();
        loggedInUser.username = 'john.smith';

        const loggedInReviewer: Reviewer = new Reviewer();
        loggedInReviewer.user = loggedInUser;
        loggedInReviewer.approved = true;

        $scope['reviewers'] = [loggedInReviewer];

        const element = $compile('<user-vote reviewers="reviewers"></user-vote>')($scope);
        $scope.$digest();

        expect(element.find('.pr-icon').length).toEqual(1);
        expect(element.find('.pr-icon').hasClass('icon-approved')).toBeTruthy();
        expect(element.find('.pr-icon').hasClass('fa-check-circle')).toBeTruthy();
    });
});
