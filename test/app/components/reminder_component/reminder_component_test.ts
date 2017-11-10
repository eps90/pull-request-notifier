import * as angular from 'angular';
import {PullRequest} from '../../../../app/models/pull_request';
import {ChromeExtensionEvent} from '../../../../app/models/event/chrome_extension_event';

describe('ReminderComponent', () => {
    let $scope: ng.IScope;
    let $compile: ng.ICompileService;
    let element: ng.IAugmentedJQuery;

    beforeEach(angular.mock.module('bitbucketNotifier'));
    beforeEach(() => {
        spyOn(chrome.runtime, 'sendMessage');
    });

    beforeEach(inject([
        '$rootScope',
        '$compile',
        ($r: ng.IRootScopeService, $c) => {
            $scope = $r.$new();
            $compile = $c;
        }
    ]));

    it('should show reminder icon', () => {
        element = $compile('<reminder></reminder>')($scope);
        $scope.$digest();

        const remindLink = element.find('a.remind-link');
        expect(remindLink.length).toEqual(1);
        expect(remindLink.find('i').first().hasClass('fa-bell')).toBeTruthy();
    });

    it('should call chrome.extension.sendMessage on click', () => {
        const pullRequest = new PullRequest();
        $scope['myPr'] = pullRequest;

        element = $compile('<reminder pull-request="myPr"></reminder>')($scope);
        $scope.$digest();

        const linkElement = element.find('a');
        linkElement.triggerHandler('click');

        expect(chrome.runtime.sendMessage).toHaveBeenCalledWith(
            new ChromeExtensionEvent(
                ChromeExtensionEvent.REMIND,
                pullRequest
            )
        );
    });

    it('should lock reminder link on click', () => {
        element = $compile('<reminder></reminder>')($scope);
        $scope.$digest();

        expect(element.find('a.remind-link').attr('disabled')).not.toEqual('disabled');
        const linkElement = element.find('a');
        linkElement.triggerHandler('click');

        expect(element.find('a.remind-link').attr('disabled')).toEqual('disabled');
    });

    it('should change reminder icon on click', () => {
        element = $compile('<reminder></reminder>')($scope);
        $scope.$digest();

        // make sure that only one icon is shown at time
        expect(element.find('a i.fa-check').length).toEqual(0);

        let linkElement = element.find('a');
        linkElement.triggerHandler('click');

        linkElement = element.find('a');
        expect(linkElement.find('i').hasClass('fa-check')).toBeTruthy();
    });

    describe('with large size', () => {
        it('should show reminder button', () => {
            element = $compile('<reminder size="lg"></reminder>')($scope);
            $scope.$digest();

            const remindLink = element.find('a.remind-button');
            expect(remindLink.length).toEqual(1);
            expect(element.find('a.remind-link').length).toEqual(0);
            expect(remindLink.find('i').first().hasClass('fa-bell')).toBeTruthy();
        });

        it('should call chrome.extension.sendMessage on click', () => {
            const pullRequest = new PullRequest();
            $scope['myPr'] = pullRequest;

            element = $compile('<reminder pull-request="myPr" size="lg"></reminder>')($scope);
            $scope.$digest();

            const linkElement = element.find('a.remind-button');
            linkElement.triggerHandler('click');

            expect(chrome.runtime.sendMessage).toHaveBeenCalledWith(
                new ChromeExtensionEvent(
                    ChromeExtensionEvent.REMIND,
                    pullRequest
                )
            );
        });

        it('should lock reminder link on click', () => {
            element = $compile('<reminder size="lg"></reminder>')($scope);
            $scope.$digest();

            expect(element.find('a.remind-button').attr('disabled')).not.toEqual('disabled');
            const linkElement = element.find('a.remind-button');
            linkElement.triggerHandler('click');

            expect(element.find('a.remind-button').attr('disabled')).toEqual('disabled');
        });

        it('should change reminder icon on click', () => {
            element = $compile('<reminder size="lg"></reminder>')($scope);
            $scope.$digest();

            // make sure that only one icon is shown at time
            expect(element.find('a.remind-button i.fa-check').length).toEqual(0);

            let linkElement = element.find('a.remind-button');
            linkElement.triggerHandler('click');

            linkElement = element.find('a.remind-button');
            expect(linkElement.find('i').hasClass('fa-check')).toBeTruthy();
        });
    });
});
