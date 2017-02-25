/// <reference path="../../../../app/_typings.ts" />

describe('NavigationBrandComponent', () => {
    var element: ng.IAugmentedJQuery,
        $scope: ng.IScope,
        $compile: ng.ICompileService;

    beforeEach(angular.mock.module('bitbucketNotifier'));
    beforeEach(angular.mock.module('bitbucketNotifier.templates'));

    beforeEach(inject([
        '$rootScope',
        '$compile',
        ($r: ng.IRootScopeService, $c) => {
            $scope = $r.$new();
            $compile = $c;
        }
    ]));

    it('should render navigation brand with icon and content', () => {
        var icon = 'bitbucket';
        var content = "My Content";

        element = $compile(`<navigation-brand icon="${icon}" content="${content}"></navigation-brand>`)($scope);
        $scope.$digest();

        var expectedIconClass = 'fa-' + icon;
        expect(element.find('.icon').first().hasClass(expectedIconClass)).toBeTruthy();
        expect(element.text()).toContain(content);
    });
});
