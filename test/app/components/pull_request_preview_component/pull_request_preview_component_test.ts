import * as angular from 'angular';
import {PullRequest} from '../../../../app/models/pull_request';
import {Reviewer} from '../../../../app/models/reviewer';

describe('PullRequestPreviewComponent', () => {
    let $scope: ng.IScope;
    let $compile: ng.ICompileService;
    let element: ng.IAugmentedJQuery;

    beforeEach(angular.mock.module('bitbucketNotifier'));
    beforeEach(inject([
        '$compile',
        '$rootScope',
        ($c, $r: ng.IRootScopeService) => {
            $compile = $c;
            $scope = $r.$new();
        }
    ]));

    it('should show pull request title', () => {
        const prTitle = 'Some title';
        const pullRequest: PullRequest = new PullRequest();
        pullRequest.title = prTitle;
        $scope['pullRequest'] = pullRequest;

        element = $compile('<pull-request-preview pr="pullRequest"></pull-request-preview>')($scope);
        $scope.$digest();

        expect(element.text()).toContain(prTitle);
    });

    it('should contain branch info', () => {
        const targetBranch = 'target_branch';
        const pullRequest: PullRequest = new PullRequest();
        pullRequest.targetBranch = targetBranch;
        $scope['pullRequest'] = pullRequest;

        element = $compile('<pull-request-preview pr="pullRequest"></pull-request-preview>')($scope);
        $scope.$digest();

        expect(element.text()).toContain(targetBranch);
    });

    it('should contain author name', () => {
        const authorName = 'John Smith';

        const pullRequest: PullRequest = new PullRequest();
        pullRequest.author.displayName = authorName;
        $scope['pullRequest'] = pullRequest;

        element = $compile('<pull-request-preview pr="pullRequest"></pull-request-preview>')($scope);
        $scope.$digest();

        expect(element.text()).toContain(authorName);
    });

    describe('description', () => {
        it('should contain pull request description', () => {
            const description = 'This is a description of a Pull Request';
            const pullRequest: PullRequest = new PullRequest();
            pullRequest.description = description;
            $scope['pullRequest'] = pullRequest;

            element = $compile('<pull-request-preview pr="pullRequest"></pull-request-preview>')($scope);
            $scope.$digest();

            expect(element.text()).toContain(description);
        });

        it('should contain proper text when there is no description', () => {
            const pullRequest: PullRequest = new PullRequest();
            pullRequest.description = '';
            $scope['pullRequest'] = pullRequest;

            element = $compile('<pull-request-preview pr="pullRequest"></pull-request-preview>')($scope);
            $scope.$digest();

            const descriptionElement = element.find('.description');
            const expectedMsg = 'No description';
            expect(descriptionElement.text()).toContain(expectedMsg);
        });
    });

    describe('reviewers', () => {
        it('should contain reviewers stats', () => {
            const approvedReviewer = new Reviewer();
            approvedReviewer.user.displayName = 'John Smith';
            approvedReviewer.approved = true;

            const unapprovedReviewer = new Reviewer();
            unapprovedReviewer.user.displayName = 'Anna Kowalsky';
            unapprovedReviewer.approved = false;

            const pullRequest = new PullRequest();
            pullRequest.reviewers = [approvedReviewer, unapprovedReviewer];

            $scope['pullRequest'] = pullRequest;

            element = $compile('<pull-request-preview pr="pullRequest"></pull-request-preview>')($scope);
            $scope.$digest();

            expect(element.text()).toContain(approvedReviewer.user.displayName);
            expect(element.text()).toContain(unapprovedReviewer.user.displayName);
        });

        it('should contain alert message when there are no reviewers', () => {
            const pullRequest = new PullRequest();
            pullRequest.reviewers = [];

            $scope['pullRequest'] = pullRequest;

            element = $compile('<pull-request-preview pr="pullRequest"></pull-request-preview>')($scope);
            $scope.$digest();

            const reviewersElement = element.find('.reviewers');
            const expectedMsg = 'No reviewers assigned';
            expect(reviewersElement.text()).toContain(expectedMsg);
        });
    });

    describe('action buttons', () => {
        it('should contain reminder button', () => {
            const approvedReviewer = new Reviewer();
            approvedReviewer.user.displayName = 'John Smith';
            approvedReviewer.approved = true;

            const unapprovedReviewer = new Reviewer();
            unapprovedReviewer.user.displayName = 'Anna Kowalsky';
            unapprovedReviewer.approved = false;

            const pullRequest = new PullRequest();
            pullRequest.reviewers = [approvedReviewer, unapprovedReviewer];

            $scope['pullRequest'] = pullRequest;

            element = $compile('<pull-request-preview pr="pullRequest"></pull-request-preview>')($scope);
            $scope.$digest();

            expect(element.find('reminder').length).toEqual(1);
        });

        it('should not contain reminder button if all reviewers has voted', () => {
            const approvedReviewer = new Reviewer();
            approvedReviewer.user.displayName = 'John Smith';
            approvedReviewer.approved = true;

            const unapprovedReviewer = new Reviewer();
            unapprovedReviewer.user.displayName = 'Anna Kowalsky';
            unapprovedReviewer.approved = true;

            const pullRequest = new PullRequest();
            pullRequest.reviewers = [approvedReviewer, unapprovedReviewer];

            $scope['pullRequest'] = pullRequest;

            element = $compile('<pull-request-preview pr="pullRequest"></pull-request-preview>')($scope);
            $scope.$digest();

            expect(element.find('reminder').length).toEqual(0);
        });

        it('should not contain reminder button if there are no reviewers', () => {
            const pullRequest = new PullRequest();
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
