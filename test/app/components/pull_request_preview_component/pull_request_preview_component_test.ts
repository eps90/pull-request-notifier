import {PullRequest, Reviewer} from "../../../../app/services/models";
import * as angular from 'angular';

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
        var pullRequest: PullRequest = new PullRequest();
        pullRequest.title = prTitle;
        $scope['pullRequest'] = pullRequest;

        element = $compile('<pull-request-preview pr="pullRequest"></pull-request-preview>')($scope);
        $scope.$digest();

        expect(element.text()).toContain(prTitle);
    });

    it('should contain branch info', () => {
        var targetBranch = 'target_branch';
        var pullRequest: PullRequest = new PullRequest();
        pullRequest.targetBranch = targetBranch;
        $scope['pullRequest'] = pullRequest;

        element = $compile('<pull-request-preview pr="pullRequest"></pull-request-preview>')($scope);
        $scope.$digest();

        expect(element.text()).toContain(targetBranch);
    });

    it('should contain author name', () => {
        var authorName = "John Smith";

        var pullRequest: PullRequest = new PullRequest();
        pullRequest.author.displayName = authorName;
        $scope['pullRequest'] = pullRequest;

        element = $compile('<pull-request-preview pr="pullRequest"></pull-request-preview>')($scope);
        $scope.$digest();

        expect(element.text()).toContain(authorName);
    });

    describe('description', () => {
        it('should contain pull request description', () => {
            var description = 'This is a description of a Pull Request';
            var pullRequest: PullRequest = new PullRequest();
            pullRequest.description = description;
            $scope['pullRequest'] = pullRequest;

            element = $compile('<pull-request-preview pr="pullRequest"></pull-request-preview>')($scope);
            $scope.$digest();

            expect(element.text()).toContain(description);
        });

        it('should contain proper text when there is no description', () => {
            var pullRequest: PullRequest = new PullRequest();
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
            var approvedReviewer = new Reviewer();
            approvedReviewer.user.displayName = "John Smith";
            approvedReviewer.approved = true;

            var unapprovedReviewer = new Reviewer();
            unapprovedReviewer.user.displayName = "Anna Kowalsky";
            unapprovedReviewer.approved = false;

            var pullRequest = new PullRequest();
            pullRequest.reviewers = [approvedReviewer, unapprovedReviewer];

            $scope['pullRequest'] = pullRequest;

            element = $compile('<pull-request-preview pr="pullRequest"></pull-request-preview>')($scope);
            $scope.$digest();

            expect(element.text()).toContain(approvedReviewer.user.displayName);
            expect(element.text()).toContain(unapprovedReviewer.user.displayName);
        });

        it('should contain alert message when there are no reviewers', () => {
            var pullRequest = new PullRequest();
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
            var approvedReviewer = new Reviewer();
            approvedReviewer.user.displayName = "John Smith";
            approvedReviewer.approved = true;

            var unapprovedReviewer = new Reviewer();
            unapprovedReviewer.user.displayName = "Anna Kowalsky";
            unapprovedReviewer.approved = false;

            var pullRequest = new PullRequest();
            pullRequest.reviewers = [approvedReviewer, unapprovedReviewer];

            $scope['pullRequest'] = pullRequest;

            element = $compile('<pull-request-preview pr="pullRequest"></pull-request-preview>')($scope);
            $scope.$digest();

            expect(element.find('reminder').length).toEqual(1);
        });

        it('should not contain reminder button if all reviewers has voted', () => {
            var approvedReviewer = new Reviewer();
            approvedReviewer.user.displayName = "John Smith";
            approvedReviewer.approved = true;

            var unapprovedReviewer = new Reviewer();
            unapprovedReviewer.user.displayName = "Anna Kowalsky";
            unapprovedReviewer.approved = true;

            var pullRequest = new PullRequest();
            pullRequest.reviewers = [approvedReviewer, unapprovedReviewer];

            $scope['pullRequest'] = pullRequest;

            element = $compile('<pull-request-preview pr="pullRequest"></pull-request-preview>')($scope);
            $scope.$digest();

            expect(element.find('reminder').length).toEqual(0);
        });

        it('should not contain reminder button if there are no reviewers', () => {
            var pullRequest = new PullRequest();
            pullRequest.reviewers = [];

            $scope['pullRequest'] = pullRequest;

            element = $compile('<pull-request-preview pr="pullRequest"></pull-request-preview>')($scope);
            $scope.$digest();

            expect(element.find('reminder').length).toEqual(0);
        });

        it('should contain button with pull request link', () => {
            $scope['pullRequest'] = new PullRequest();

            element = $compile('<pull-request-preview pr="pullRequest"></pull-request-preview>')($scope);
            $scope.$digest();

            expect(element.find('pull-request-link').length).toEqual(1);
        });
    });
});
