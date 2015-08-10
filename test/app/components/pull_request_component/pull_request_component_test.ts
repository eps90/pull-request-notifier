///<reference path="../../../../app/_typings.ts"/>

describe('PullRequestComponent', () => {
    var element,
        $compile: ng.ICompileService,
        $scope: ng.IRootScopeService,
        $templateCache: ng.ITemplateCacheService;

    beforeEach(module('bitbucketNotifier'));
    beforeEach(module('bitbucketNotifier.templates'));

    beforeEach(
        inject([
            '$compile',
            '$rootScope',
            '$templateCache',
            ($c, $s, $t) => {
                $compile = $c;
                $scope = $s;
                $templateCache = $t;
            }
        ])
    );

    beforeEach(() => {
        var author:BitbucketNotifier.User = new BitbucketNotifier.User();
        author.displayName = 'John Smith';

        var userAsReviewer:BitbucketNotifier.User = new BitbucketNotifier.User();
        userAsReviewer.displayName = 'Anna Kowalsky';

        var reviewer:BitbucketNotifier.Reviewer = new BitbucketNotifier.Reviewer();
        reviewer.user = userAsReviewer;
        reviewer.approved = true;

        var project:BitbucketNotifier.Project = new BitbucketNotifier.Project();
        project.name = 'CRM';
        project.fullName = 'dacsoftware/crm';

        var pullRequest:BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
        pullRequest.id = 1;
        pullRequest.title = 'This is a pull request';
        pullRequest.author = author;
        pullRequest.reviewers.push(reviewer);
        pullRequest.targetRepository = project;
        pullRequest.targetBranch = 'master';

        $scope['pullRequest'] = pullRequest;

        element = $compile('<pull-request pr="pullRequest"></pull-request>')($scope);
        $scope.$digest();
    });

    it("should render basic pull request information", () => {
        expect(element.html()).toContain('John Smith');
        expect(element.html()).toContain('CRM');
        expect(element.html()).toContain('1');
    });
});
