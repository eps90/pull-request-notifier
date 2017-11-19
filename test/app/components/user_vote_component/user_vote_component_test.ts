import * as angular from 'angular';
import {User} from '../../../../app/models/user';
import {Reviewer} from '../../../../app/models/reviewer';
import {ConfigProvider} from '../../../../app/services/config/config_provider';
import {InMemoryConfigStorage} from '../../../../app/services/config/in_memory_config_storage';
import {ConfigObject} from '../../../../app/models/config_object';
import {Config} from '../../../../app/services/config/config';

describe('UserVoteComponent', () => {
    let $scope: ng.IScope;
    let $compile: ng.ICompileService;
    let config: Config;

    beforeEach(angular.mock.module('bitbucketNotifier'));
    beforeEach(angular.mock.module([
        'configProvider', (configProvider: ConfigProvider) => {
            configProvider.useCustomStorage(new InMemoryConfigStorage());
            configProvider.setDefaults(new Map([
                [ConfigObject.USER, 'john.smith']
            ]));
        }
    ]));

    beforeEach(inject([
        '$rootScope',
        '$compile',
        'config',
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
