///<reference path="../../../../app/_typings.ts"/>

describe("NavigationBarComponent", () => {
    var $scope: ng.IScope,
        $compile: ng.ICompileService,
        element: ng.IAugmentedJQuery,
        appVersion = '1.0.0',
        bitbucketUrl = 'http://example.com';

    beforeEach(module('bitbucketNotifier'));
    beforeEach(module('bitbucketNotifier.templates'));
    beforeEach(() => [
        window['chrome'] = {
            runtime: {
                getManifest: jasmine.createSpy('chrome.runtime.getManifest').and.returnValue({version: appVersion})
            },
            tabs: {
                create: jasmine.createSpy('chrome.tabs.create')
            }
        }
    ]);
    beforeEach(module([
        '$provide',
        ($provide: ng.auto.IProvideService) => {
            $provide.value('bitbucketUrl', bitbucketUrl);
        }
    ]));
    beforeEach(inject([
        '$compile',
        '$rootScope',
        ($c, $r: ng.IRootScopeService) => {
            $compile = $c;
            $scope = $r.$new()
        }
    ]));

    it('should display current application version', () => {
        element = $compile('<navigation-bar></navigation-bar>')($scope);
        $scope.$digest();

        var versionField = element.find('.app-version');
        var expectedAppVersion = 'v' + appVersion;
        expect(versionField.text()).toEqual(expectedAppVersion);
    });

    it('should have link following to Bitbucket page', () => {
        element = $compile('<navigation-bar></navigation-bar>')($scope);
        $scope.$digest();

        var linkElement = element.find('a.bitbucket-logo');
        linkElement.triggerHandler('click');

        expect(window['chrome'].tabs.create).toHaveBeenCalledWith({url: bitbucketUrl});
    });
});
