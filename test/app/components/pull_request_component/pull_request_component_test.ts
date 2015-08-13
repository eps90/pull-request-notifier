///<reference path="../../../../app/_typings.ts"/>

describe('PullRequestComponent', () => {
    var element,
        $compile: ng.ICompileService,
        $scope: ng.IRootScopeService,
        pullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();

    beforeEach(module('bitbucketNotifier'));
    beforeEach(module('bitbucketNotifier.templates'));

    beforeEach(
        inject([
            '$compile',
            '$rootScope',
            ($c, $s) => {
                $compile = $c;
                $scope = $s;
            }
        ])
    );

    beforeEach(() => {
        var author:BitbucketNotifier.User = new BitbucketNotifier.User();
        author.displayName = 'John Smith';

        var userAsReviewer:BitbucketNotifier.User = new BitbucketNotifier.User();
        userAsReviewer.displayName = 'Anna Kowalsky';

        var secondUserAsReviewer:BitbucketNotifier.User = new BitbucketNotifier.User();
        secondUserAsReviewer.displayName = 'Jack Sparrow';

        var reviewer:BitbucketNotifier.Reviewer = new BitbucketNotifier.Reviewer();
        reviewer.user = userAsReviewer;
        reviewer.approved = true;

        var secondReviewer:BitbucketNotifier.Reviewer = new BitbucketNotifier.Reviewer();
        secondReviewer.user = secondUserAsReviewer;
        secondReviewer.approved = false;

        var project:BitbucketNotifier.Project = new BitbucketNotifier.Project();
        project.name = 'CRM';
        project.fullName = 'dacsoftware/crm';

        pullRequest.id = 1;
        pullRequest.title = 'This is a pull request';
        pullRequest.author = author;
        pullRequest.reviewers.push(reviewer, secondReviewer);
        pullRequest.targetRepository = project;
        pullRequest.targetBranch = 'master';
    });

    describe('Authored mode', () => {
        beforeEach(() => {
            $scope['pullRequest'] = pullRequest;
            $scope['displayMode'] = 'AUTHORED';

            element = $compile('<pull-request pr="pullRequest" mode="displayMode"></pull-request>')($scope);
            $scope.$digest();
        });

        it("should render basic pull request information", () => {
            expect(element.html()).toContain('1');
            expect(element.html()).toContain('John Smith');
            expect(element.html()).toContain('This is a pull request');
            expect(element.html()).toContain('CRM');
            expect(element.find('approval-progress').length).toEqual(1);
        });
    });

    describe('Assigned mode', () => {
        beforeEach(() => {
            $scope['pullRequest'] = pullRequest;
            $scope['displayMode'] = 'ASSIGNED';

            element = $compile('<pull-request pr="pullRequest" mode="displayMode"></pull-request>')($scope);
            $scope.$digest();
        });

        it("should render basic pull request information", () => {
            expect(element.html()).toContain('1');
            expect(element.html()).toContain('John Smith');
            expect(element.html()).toContain('This is a pull request');
            expect(element.html()).toContain('CRM');
            expect(element.find('user-vote').length).toEqual(1);
        });
    });
});
