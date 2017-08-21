describe('NavigationBrandComponent', () => {
    let element: ng.IAugmentedJQuery;
    let $scope: ng.IScope;
    let $compile: ng.ICompileService;

    beforeEach(angular.mock.module('bitbucketNotifier'));
    beforeEach(inject([
        '$rootScope',
        '$compile',
        ($r: ng.IRootScopeService, $c) => {
            $scope = $r.$new();
            $compile = $c;
        }
    ]));

    it('should render navigation brand with icon and content', () => {
        const icon = 'bitbucket';
        const content = 'My Content';

        element = $compile(`<navigation-brand icon="${icon}" content="${content}"></navigation-brand>`)($scope);
        $scope.$digest();

        const expectedIconClass = 'fa-' + icon;
        expect(element.find('.icon').first().hasClass(expectedIconClass)).toBeTruthy();
        expect(element.text()).toContain(content);
    });
});
