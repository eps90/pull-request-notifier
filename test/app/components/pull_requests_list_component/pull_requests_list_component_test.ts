///<reference path="../../../../app/_typings.ts"/>

describe('PullRequestsListComponent', () => {
    beforeEach(module('bitbucketNotifier'));
    var element,
        $compile: ng.ICompileService,
        $scope: ng.IRootScopeService,
        pullRequests: Array<BitbucketNotifier.PullRequest> = [];

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

        var pullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();

        pullRequest.id = 1;
        pullRequest.title = 'This is a pull request';
        pullRequest.author = author;
        pullRequest.reviewers.push(reviewer, secondReviewer);
        pullRequest.targetRepository = project;
        pullRequest.targetBranch = 'master';

        pullRequests.push(pullRequest);
    });

    describe('Authored mode', () => {
        it('should render list of pull requests', () => {
            $scope['pullRequests'] = pullRequests;
            element = $compile('<pull-requests-list pull-requests="pullRequests" mode="\'AUTHORED\'"></pull-requests-list>')($scope);
            $scope.$digest();

            var childPullRequest = element.find('pull-request');

            expect(childPullRequest.length).toEqual(1);
            expect(childPullRequest.scope().mode).toEqual('AUTHORED');
        });
    });
});
