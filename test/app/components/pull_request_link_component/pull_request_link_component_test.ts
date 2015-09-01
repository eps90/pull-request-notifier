///<reference path="../../../../app/_typings.ts"/>

describe('PullRequestLinkComponent', () => {
    var $scope: ng.IScope,
        $compile: ng.ICompileService,
        element: ng.IAugmentedJQuery,
        newTabObj;

    beforeEach(module('bitbucketNotifier'));
    beforeEach(module('bitbucketNotifier.templates'));
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
        var pullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
        pullRequest.links.html = 'http://example.com';

        $scope['pullRequest'] = pullRequest;

        element = $compile('<pull-request-link pr="pullRequest"></pull-request-link>')($scope);
        $scope.$digest();

        var linkElement = element.find('i.external-link-icon');
        expect(linkElement.hasClass('fa-external-link')).toBeTruthy();
    });

    it('should have link to pull request', () => {
        var pullRequestLink = 'http://example.com';
        var pullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
        pullRequest.links.html = pullRequestLink;

        $scope['pullRequest'] = pullRequest;

        element = $compile('<pull-request-link pr="pullRequest"></pull-request-link>')($scope);
        $scope.$digest();

        var linkElement = element.find('a');
        expect(linkElement.attr('href')).toEqual(pullRequestLink);
    });

    it('should open new tab with given pull request', () => {
        var pullRequestLink = 'http://example.com';
        var pullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
        pullRequest.links.html = pullRequestLink;

        $scope['pullRequest'] = pullRequest;

        element = $compile('<pull-request-link pr="pullRequest"></pull-request-link>')($scope);
        $scope.$digest();

        var linkElement = element.find('a');
        linkElement.triggerHandler('click');

        expect(window['chrome'].tabs.create).toHaveBeenCalled();
        expect(newTabObj.url).toEqual(pullRequestLink);
    });
});
