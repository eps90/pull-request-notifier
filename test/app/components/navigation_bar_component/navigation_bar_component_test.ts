///<reference path="../../../../app/_typings.ts"/>

describe("NavigationBarComponent", () => {
    var $scope: ng.IScope,
        $compile: ng.ICompileService,
        element: ng.IAugmentedJQuery,
        appVersion = '1.0.0';

    beforeEach(module('bitbucketNotifier'));
    beforeEach(module('bitbucketNotifier.templates'));
    beforeEach(() => [
        window['chrome'] = {
            runtime: {
                getManifest: jasmine.createSpy('chrome.runtime.getManifest').and.returnValue({version: appVersion})
            }
        }
    ]);
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
});
