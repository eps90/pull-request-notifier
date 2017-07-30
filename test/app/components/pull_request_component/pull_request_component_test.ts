import {Project, PullRequest, Reviewer, User} from "../../../../app/services/models";
import * as angular from 'angular';

describe('PullRequestComponent', () => {
    var element,
        $compile: ng.ICompileService,
        $scope: ng.IRootScopeService,
        uiRouterState: angular.ui.IStateService,
        pullRequest: PullRequest = new PullRequest();

    beforeEach(angular.mock.module('bitbucketNotifier'));
    beforeEach(angular.mock.module([
        '$provide',
        ($provide: ng.auto.IProvideService) => {
            $provide.value('$state', {
                go: jasmine.createSpy('$state.go')
            });
        }
    ]));

    beforeEach(
        inject([
            '$compile',
            '$rootScope',
            '$state',
            ($c, $s, $state) => {
                $compile = $c;
                $scope = $s;
                uiRouterState = $state;
            }
        ])
    );

    beforeEach(() => {
        var author: User = new User();
        author.displayName = 'John Smith';

        var userAsReviewer: User = new User();
        userAsReviewer.displayName = 'Anna Kowalsky';

        var secondUserAsReviewer: User = new User();
        secondUserAsReviewer.displayName = 'Jack Sparrow';

        var reviewer: Reviewer = new Reviewer();
        reviewer.user = userAsReviewer;
        reviewer.approved = true;

        var secondReviewer: Reviewer = new Reviewer();
        secondReviewer.user = secondUserAsReviewer;
        secondReviewer.approved = false;

        var project: Project = new Project();
        project.name = 'CRM';
        project.fullName = 'dacsoftware/my_sweet_project';

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

            element = $compile('<pull-request pr="pullRequest" mode="AUTHORED"></pull-request>')($scope);
            $scope.$digest();
        });

        it("should render basic pull request information", () => {
            expect(element.html()).toContain('1');
            expect(element.html()).toContain('John Smith');
            expect(element.html()).toContain('This is a pull request');
            expect(element.html()).toContain('CRM');
            expect(element.find('approval-progress').length).toEqual(1);
            expect(element.find('reminder').length).toEqual(1);
        });
    });

    describe('Assigned mode', () => {
        beforeEach(() => {
            $scope['pullRequest'] = pullRequest;

            element = $compile('<pull-request pr="pullRequest" mode="ASSIGNED"></pull-request>')($scope);
            $scope.$digest();
        });

        it("should render basic pull request information", () => {
            expect(element.html()).toContain('1');
            expect(element.html()).toContain('John Smith');
            expect(element.html()).toContain('This is a pull request');
            expect(element.html()).toContain('CRM');
            expect(element.find('user-vote').length).toEqual(1);
            expect(element.find('reminder').length).toEqual(1);
        });
    });

    it('should go to pull request on click', () => {
        $scope['pullRequest'] = pullRequest;
        element = $compile('<pull-request pr="pullRequest" mode="ASSIGNED"></pull-request>')($scope);
        $scope.$digest();

        element.click().triggerHandler('click');
        expect(uiRouterState.go).toHaveBeenCalledWith(
            'pull_request',
            {
                repositoryName: 'dacsoftware__my_sweet_project',
                pullRequestId: 1
            }
        );
    });
});
