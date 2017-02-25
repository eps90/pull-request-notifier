///<reference path="../../../../app/_typings.ts"/>

describe('PullRequestPreviewComponent', () => {
    var $scope: ng.IScope,
        $compile: ng.ICompileService,
        element: ng.IAugmentedJQuery;

    beforeEach(angular.mock.module('bitbucketNotifier'));
    beforeEach(angular.mock.module('bitbucketNotifier.templates'));
    beforeEach(inject([
        '$compile',
        '$rootScope',
        ($c, $r: ng.IRootScopeService) => {
            $compile = $c;
            $scope = $r.$new();
        }
    ]));

    it('should show pull request title', () => {
        var prTitle = 'Some title';
        var pullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
        pullRequest.title = prTitle;
        $scope['pullRequest'] = pullRequest;

        element = $compile('<pull-request-preview pr="pullRequest"></pull-request-preview>')($scope);
        $scope.$digest();

        expect(element.text()).toContain(prTitle);
    });

    it('should contain branch info', () => {
        var targetBranch = 'target_branch';
        var pullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
        pullRequest.targetBranch = targetBranch;
        $scope['pullRequest'] = pullRequest;

        element = $compile('<pull-request-preview pr="pullRequest"></pull-request-preview>')($scope);
        $scope.$digest();

        expect(element.text()).toContain(targetBranch);
    });

    it('should contain author name', () => {
        var authorName = "John Smith";

        var pullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
        pullRequest.author.displayName = authorName;
        $scope['pullRequest'] = pullRequest;

        element = $compile('<pull-request-preview pr="pullRequest"></pull-request-preview>')($scope);
        $scope.$digest();

        expect(element.text()).toContain(authorName);
    });

    describe('description', () => {
        it('should contain pull request description', () => {
            var description = 'This is a description of a Pull Request';
            var pullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
            pullRequest.description = description;
            $scope['pullRequest'] = pullRequest;

            element = $compile('<pull-request-preview pr="pullRequest"></pull-request-preview>')($scope);
            $scope.$digest();

            expect(element.text()).toContain(description);
        });

        it('should contain proper text when there is no description', () => {
            var pullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
            pullRequest.description = "";
            $scope['pullRequest'] = pullRequest;

            element = $compile('<pull-request-preview pr="pullRequest"></pull-request-preview>')($scope);
            $scope.$digest();

            var descriptionElement = element.find('.description');
            var expectedMsg = "No description";
            expect(descriptionElement.text()).toContain(expectedMsg);
        });
    });

    describe('reviewers', () => {
        it('should contain reviewers stats', () => {
            var approvedReviewer = new BitbucketNotifier.Reviewer();
            approvedReviewer.user.displayName = "John Smith";
            approvedReviewer.approved = true;

            var unapprovedReviewer = new BitbucketNotifier.Reviewer();
            unapprovedReviewer.user.displayName = "Anna Kowalsky";
            unapprovedReviewer.approved = false;

            var pullRequest = new BitbucketNotifier.PullRequest();
            pullRequest.reviewers = [approvedReviewer, unapprovedReviewer];

            $scope['pullRequest'] = pullRequest;

            element = $compile('<pull-request-preview pr="pullRequest"></pull-request-preview>')($scope);
            $scope.$digest();

            expect(element.text()).toContain(approvedReviewer.user.displayName);
            expect(element.text()).toContain(unapprovedReviewer.user.displayName);
        });

        it('should contain alert message when there are no reviewers', () => {
            var pullRequest = new BitbucketNotifier.PullRequest();
            pullRequest.reviewers = [];

            $scope['pullRequest'] = pullRequest;

            element = $compile('<pull-request-preview pr="pullRequest"></pull-request-preview>')($scope);
            $scope.$digest();

            var reviewersElement = element.find('.reviewers');
            var expectedMsg = "No reviewers assigned";
            expect(reviewersElement.text()).toContain(expectedMsg);
        });
    });

    describe('action buttons', () => {
        it('should contain reminder button', () => {
            var approvedReviewer = new BitbucketNotifier.Reviewer();
            approvedReviewer.user.displayName = "John Smith";
            approvedReviewer.approved = true;

            var unapprovedReviewer = new BitbucketNotifier.Reviewer();
            unapprovedReviewer.user.displayName = "Anna Kowalsky";
            unapprovedReviewer.approved = false;

            var pullRequest = new BitbucketNotifier.PullRequest();
            pullRequest.reviewers = [approvedReviewer, unapprovedReviewer];

            $scope['pullRequest'] = pullRequest;

            element = $compile('<pull-request-preview pr="pullRequest"></pull-request-preview>')($scope);
            $scope.$digest();

            expect(element.find('reminder').length).toEqual(1);
        });

        it('should not contain reminder button if all reviewers has voted', () => {
            var approvedReviewer = new BitbucketNotifier.Reviewer();
            approvedReviewer.user.displayName = "John Smith";
            approvedReviewer.approved = true;

            var unapprovedReviewer = new BitbucketNotifier.Reviewer();
            unapprovedReviewer.user.displayName = "Anna Kowalsky";
            unapprovedReviewer.approved = true;

            var pullRequest = new BitbucketNotifier.PullRequest();
            pullRequest.reviewers = [approvedReviewer, unapprovedReviewer];

            $scope['pullRequest'] = pullRequest;

            element = $compile('<pull-request-preview pr="pullRequest"></pull-request-preview>')($scope);
            $scope.$digest();

            expect(element.find('reminder').length).toEqual(0);
        });

        it('should not contain reminder button if there are no reviewers', () => {
            var pullRequest = new BitbucketNotifier.PullRequest();
            pullRequest.reviewers = [];

            $scope['pullRequest'] = pullRequest;

            element = $compile('<pull-request-preview pr="pullRequest"></pull-request-preview>')($scope);
            $scope.$digest();

            expect(element.find('reminder').length).toEqual(0);
        });

        it('should contain button with pull request link', () => {
            $scope['pullRequest'] = new BitbucketNotifier.PullRequest();

            element = $compile('<pull-request-preview pr="pullRequest"></pull-request-preview>')($scope);
            $scope.$digest();

            expect(element.find('pull-request-link').length).toEqual(1);
        });
    });
});
