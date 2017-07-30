describe('PullRequestsHeaderComponent', () => {
    var $scope: ng.IScope,
        $compile: ng.ICompileService,
        element;

    beforeEach(angular.mock.module('bitbucketNotifier'));
    beforeEach(inject([
        '$rootScope',
        '$compile',
        ($s, $c) => {
            $scope = $s;
            $compile = $c;
        }
    ]));

    it('should display header for authored mode', () => {
        element = $compile('<pull-requests-header mode="AUTHORED"></pull-requests-header>')($scope);
        $scope.$digest();

        expect(element.text()).toContain('Id');
        expect(element.text()).toContain('Title');
        expect(element.text()).toContain('Project');
        expect(element.text()).toContain('Author');
        expect(element.text()).toContain('Progress');
    });

    it('should display header for assigned mode', () => {
        element = $compile('<pull-requests-header mode="ASSIGNED"></pull-requests-header>')($scope);
        $scope.$digest();

        expect(element.text()).toContain('Id');
        expect(element.text()).toContain('Title');
        expect(element.text()).toContain('Project');
        expect(element.text()).toContain('Author');
        expect(element.text()).toContain('Voting');
    });
});
