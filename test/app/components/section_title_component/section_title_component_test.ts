///<reference path="../../../../app/_typings.ts"/>

describe('Section title component', () => {
    var $scope: ng.IScope,
        $compile: ng.ICompileService,
        element: ng.IAugmentedJQuery;

    beforeEach(module('bitbucketNotifier'));
    beforeEach(module('bitbucketNotifier.templates'));
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
        var titleElement = element.find('h2.title');

        expect(_.trim(titleElement.text())).toEqual('This is a title');
    });

    it('should render an icon', () => {
        element = $compile('<section-title icon="cogs">This is a title</section-title>')($scope);
        $scope.$digest();

        var iconElement = element.find('i');
        expect(iconElement.hasClass('fa')).toBeTruthy();
        expect(iconElement.hasClass('fa-cogs')).toBeTruthy();
        expect(iconElement.hasClass('title-icon')).toBeTruthy();
    });
});
