import * as angular from 'angular';
import {PullRequest} from '../../../../app/models/pull_request';
import {User} from '../../../../app/models/user';
import {Reviewer} from '../../../../app/models/reviewer';
import {Project} from '../../../../app/models/project';

describe('PullRequestComponent', () => {
    let element,
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
        const author: User = new User();
        author.displayName = 'John Smith';

        const userAsReviewer: User = new User();
        userAsReviewer.displayName = 'Anna Kowalsky';

        const secondUserAsReviewer: User = new User();
        secondUserAsReviewer.displayName = 'Jack Sparrow';

        const reviewer: Reviewer = new Reviewer();
        reviewer.user = userAsReviewer;
        reviewer.approved = true;

        const secondReviewer: Reviewer = new Reviewer();
        secondReviewer.user = secondUserAsReviewer;
        secondReviewer.approved = false;

        const project: Project = new Project();
        project.name = 'CRM';
        project.fullName = 'company_name/my_sweet_project';

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

        it('should render basic pull request information', () => {
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

        it('should render basic pull request information', () => {
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
                repositoryName: 'company_name__my_sweet_project',
                pullRequestId: 1
            }
        );
    });
});
