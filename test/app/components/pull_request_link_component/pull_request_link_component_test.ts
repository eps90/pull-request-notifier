import {PullRequest} from "../../../../app/services/models";
import * as angular from 'angular';

describe('PullRequestLinkComponent', () => {
    var $scope: ng.IScope,
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
        var pullRequest: PullRequest = new PullRequest();
        pullRequest.links.html = 'http://example.com';

        $scope['pullRequest'] = pullRequest;

        element = $compile('<pull-request-link pr="pullRequest"></pull-request-link>')($scope);
        $scope.$digest();

        var linkElement = element.find('i.external-link-icon');
        expect(linkElement.hasClass('fa-external-link')).toBeTruthy();
    });

    it('should open new tab with given pull request', () => {
        var pullRequestLink = 'http://example.com';
        var pullRequest: PullRequest = new PullRequest();
        pullRequest.links.html = pullRequestLink;

        $scope['pullRequest'] = pullRequest;

        element = $compile('<pull-request-link pr="pullRequest"></pull-request-link>')($scope);
        $scope.$digest();

        var linkElement = element.find('a');
        var handler = <JQueryEventObject>{type: 'click', which: 1};
        linkElement.triggerHandler(handler);

        expect(window['chrome'].tabs.create).toHaveBeenCalled();
        expect(newTabObj.url).toEqual(pullRequestLink);
    });

    describe('with large size', () => {
        it('should be able to render large button', () => {
            var pullRequestLink = 'http://example.com';
            var pullRequest: PullRequest = new PullRequest();
            pullRequest.links.html = pullRequestLink;

            $scope['pullRequest'] = pullRequest;

            element = $compile('<pull-request-link  size="lg" pr="pullRequest"></pull-request-link>')($scope);
            $scope.$digest();


            expect(element.find('.pull-request-link-button').length).toEqual(1);
            expect(element.find('.pull-request-link').length).toEqual(0);
        });

        it('should open new tab with given pull request', () => {
            var pullRequestLink = 'http://example.com';
            var pullRequest: PullRequest = new PullRequest();
            pullRequest.links.html = pullRequestLink;

            $scope['pullRequest'] = pullRequest;

            element = $compile('<pull-request-link size="lg" pr="pullRequest"></pull-request-link>')($scope);
            $scope.$digest();

            var linkElement = element.find('a');
            var handler = <JQueryEventObject>{type: 'click', which: 1};
            linkElement.triggerHandler(handler);

            expect(window['chrome'].tabs.create).toHaveBeenCalled();
            expect(newTabObj.url).toEqual(pullRequestLink);
        });
    });
});
