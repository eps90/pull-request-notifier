import * as angular from 'angular';

describe('NavigationBarComponent', () => {
    let $scope: ng.IScope;
    let $compile: ng.ICompileService;
    let element: ng.IAugmentedJQuery;
    const appVersion = '1.0.0';
    const bitbucketUrl = 'http://example.com';

    beforeEach(angular.mock.module('bitbucketNotifier'));
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
    beforeEach(angular.mock.module([
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
            $scope = $r.$new();
        }
    ]));

    it('should display current application version', () => {
        element = $compile('<navigation-bar></navigation-bar>')($scope);
        $scope.$digest();

        const versionField = element.find('.app-version');
        const expectedAppVersion = 'v' + appVersion;
        expect(versionField.text()).toEqual(expectedAppVersion);
    });
});
