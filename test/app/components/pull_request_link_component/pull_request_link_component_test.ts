import * as angular from 'angular';
import {PullRequest} from '../../../../app/models/pull_request';

describe('PullRequestLinkComponent', () => {
    let $scope: ng.IScope,
        $compile: ng.ICompileService,
        element: ng.IAugmentedJQuery,
        newTabObj;

    beforeEach(angular.mock.module('bitbucketNotifier'));
    beforeEach(() => {
        window['chrome'] = {
            tabs: {
                create: jasmine.createSpy('chrome.tabs.create').and.callFake((obj) => {
                    newTabObj = obj;
                })
            }
        };
    });

    beforeEach(inject([
        '$rootScope',
        '$compile',
        ($r: ng.IRootScopeService, $c) => {
            $scope = $r.$new();
            $compile = $c;
        }
    ]));

    it('should display external link icon', () => {
        const pullRequest: PullRequest = new PullRequest();
        pullRequest.links.html = 'http://example.com';

        $scope['pullRequest'] = pullRequest;

        element = $compile('<pull-request-link pr="pullRequest"></pull-request-link>')($scope);
        $scope.$digest();

        const linkElement = element.find('i.external-link-icon');
        expect(linkElement.hasClass('fa-external-link')).toBeTruthy();
    });

    it('should open new tab with given pull request', () => {
        const pullRequestLink = 'http://example.com';
        const pullRequest: PullRequest = new PullRequest();
        pullRequest.links.html = pullRequestLink;

        $scope['pullRequest'] = pullRequest;

        element = $compile('<pull-request-link pr="pullRequest"></pull-request-link>')($scope);
        $scope.$digest();

        const linkElement = element.find('a');
        const handler = {type: 'click', which: 1} as JQueryEventObject;
        linkElement.triggerHandler(handler);

        expect(window['chrome'].tabs.create).toHaveBeenCalled();
        expect(newTabObj.url).toEqual(pullRequestLink);
    });

    describe('with large size', () => {
        it('should be able to render large button', () => {
            const pullRequestLink = 'http://example.com';
            const pullRequest: PullRequest = new PullRequest();
            pullRequest.links.html = pullRequestLink;

            $scope['pullRequest'] = pullRequest;

            element = $compile('<pull-request-link  size="lg" pr="pullRequest"></pull-request-link>')($scope);
            $scope.$digest();

            expect(element.find('.pull-request-link-button').length).toEqual(1);
            expect(element.find('.pull-request-link').length).toEqual(0);
        });

        it('should open new tab with given pull request', () => {
            const pullRequestLink = 'http://example.com';
            const pullRequest: PullRequest = new PullRequest();
            pullRequest.links.html = pullRequestLink;

            $scope['pullRequest'] = pullRequest;

            element = $compile('<pull-request-link size="lg" pr="pullRequest"></pull-request-link>')($scope);
            $scope.$digest();

            const linkElement = element.find('a');
            const handler = {type: 'click', which: 1} as JQueryEventObject;
            linkElement.triggerHandler(handler);

            expect(window['chrome'].tabs.create).toHaveBeenCalled();
            expect(newTabObj.url).toEqual(pullRequestLink);
        });
    });
});
