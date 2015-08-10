///<reference path="../../../../app/_typings.ts"/>

describe('PullRequestComponent', () => {
    beforeEach(module('bitbucketNotifier'));
    beforeEach(module('bitbucketNotifier.templates'));

    var element,
        $compile: ng.ICompileService,
        $rootScope: ng.IRootScopeService,
        $templateCache: ng.ITemplateCacheService;

    beforeEach(
        inject([
            '$compile',
            '$rootScope',
            '$templateCache',
            ($c, $s, $t) => {
                $compile = $c;
                $rootScope = $s.$new();
                $templateCache = $t;
            }
        ])
    );

    it("should render 'Hello world'", () => {
        element = $compile('<pull-request></pull-request>')($rootScope);
        $rootScope.$digest();
        expect(element.html()).toContain('Hello world');
    });
});
