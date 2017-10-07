describe('Section title component', () => {
    let $scope: ng.IScope;
    let $compile: ng.ICompileService;
    let element: ng.IAugmentedJQuery;

    beforeEach(angular.mock.module('bitbucketNotifier'));
    beforeEach(inject([
        '$rootScope',
        '$compile',
        ($r: ng.IRootScopeService, $c) => {
            $scope = $r.$new();
            $compile = $c;
        }
    ]));

    it('should render a title', () => {
        element = $compile('<section-title>This is a title</section-title>')($scope);
        $scope.$digest();
        const titleElement = element.find('h2.title');

        expect(_.trim(titleElement.text())).toEqual('This is a title');
    });

    it('should render an icon', () => {
        element = $compile('<section-title icon="cogs">This is a title</section-title>')($scope);
        $scope.$digest();

        const iconElement = element.find('i');
        expect(iconElement.hasClass('fa')).toBeTruthy();
        expect(iconElement.hasClass('fa-cogs')).toBeTruthy();
        expect(iconElement.hasClass('title-icon')).toBeTruthy();
    });
});
