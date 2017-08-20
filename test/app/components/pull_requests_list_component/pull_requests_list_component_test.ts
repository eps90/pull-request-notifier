import {PullRequestRepository} from '../../../../app/services/pull_request_repository';
import * as angular from 'angular';
import {PullRequest} from '../../../../app/models/pull_request';
import {User} from '../../../../app/models/user';
import {Reviewer} from '../../../../app/models/reviewer';
import {Project} from '../../../../app/models/project';
import {ConfigObject} from '../../../../app/models/config_object';

describe('PullRequestsListComponent', () => {
    beforeEach(angular.mock.module('bitbucketNotifier'));
    let element,
        $compile: ng.ICompileService,
        $scope: ng.IRootScopeService,
        pullRequests: PullRequest[] = [],
        localStorageService: angular.local.storage.ILocalStorageService,
        pullRequestRepository: PullRequestRepository;

    beforeEach(() => {
        window['chrome'] = {
            extension: {
                connect: jasmine.createSpy('chrome.extension.connect').and.callFake(() => {
                    return {
                        onMessage: {
                            addListener: jasmine.createSpy('port.onMessage.addListener')
                        }
                    };
                }),
                onMessage: {
                    addListener: jasmine.createSpy('chrome.extension.onMessage.addListener')
                },
                onConnect: {
                    addListener: jasmine.createSpy('chrome.extension.onConnect.addListener')
                }
            }
        };
    });

    beforeEach(angular.mock.module('bitbucketNotifier'));
    beforeEach(
        inject([
            '$compile',
            '$rootScope',
            'localStorageService',
            'PullRequestRepository',
            ($c, $s, $l, $p) => {
                $compile = $c;
                $scope = $s;
                localStorageService = $l;
                pullRequestRepository = $p;
            }
        ])
    );

    beforeEach(() => {
        let loggedInUser: User = new User();
        loggedInUser.displayName = 'John Smith';
        loggedInUser.username = 'john.smith';

        let nonLoggedInUser: User = new User();
        nonLoggedInUser.displayName = 'Anna Kowalsky';
        nonLoggedInUser.username = 'anna.kowalsky';

        let loggedInReviewer: Reviewer = new Reviewer();
        loggedInReviewer.user = loggedInUser;
        loggedInReviewer.approved = true;

        let nonLoggedInReviewer: Reviewer = new Reviewer();
        nonLoggedInReviewer.user = nonLoggedInUser;
        nonLoggedInReviewer.approved = false;

        let project: Project = new Project();
        project.name = 'CRM';
        project.fullName = 'dacsoftware/crm';

        let authoredPullRequest: PullRequest = new PullRequest();

        authoredPullRequest.id = 1;
        authoredPullRequest.title = 'This is a pull request';
        authoredPullRequest.author = loggedInUser;
        authoredPullRequest.reviewers.push(nonLoggedInReviewer);
        authoredPullRequest.targetRepository = project;
        authoredPullRequest.targetBranch = 'master';

        let assignedPullRequest: PullRequest = new PullRequest();
        assignedPullRequest.id = 2;
        assignedPullRequest.author = nonLoggedInUser;
        assignedPullRequest.title = 'This is another title';
        assignedPullRequest.reviewers = [loggedInReviewer, nonLoggedInReviewer];
        assignedPullRequest.targetRepository = project;
        assignedPullRequest.targetBranch = 'master';

        pullRequests = [authoredPullRequest, assignedPullRequest];

        pullRequestRepository.pullRequests = pullRequests;
    });

    describe('Authored mode', () => {
        beforeEach(() => {
            localStorageService.set(ConfigObject.USER, 'john.smith');
        });

        it('should render list of pull requests', () => {
            element = $compile('<pull-requests-list></pull-requests-list>')($scope);
            $scope.$digest();

            let childPullRequest = element.find('.pull-requests-list.authored pull-request');

            expect(childPullRequest.length).toEqual(1);
            expect(childPullRequest.attr('mode')).toEqual('AUTHORED');
        });

        it('should update pull requests list when pull requests repository changes', () => {
            element = $compile('<pull-requests-list></pull-requests-list>')($scope);
            $scope.$digest();

            let childPullRequest = element.find('.pull-requests-list.authored pull-request');

            expect(childPullRequest.length).toEqual(1);

            let loggedInUser = new User();
            loggedInUser.username = 'john.smith';
            let newPullRequest: PullRequest = new PullRequest();
            newPullRequest.author = loggedInUser;

            pullRequestRepository.pullRequests.push(newPullRequest);
            $scope.$digest();

            childPullRequest = element.find('.pull-requests-list.authored pull-request');
            expect(childPullRequest.length).toEqual(2);
        });

        it('should display proper message when pull requests list is empty', () => {
            pullRequestRepository.pullRequests.splice(0, 1);

            element = $compile('<pull-requests-list></pull-requests-list>')($scope);
            $scope.$digest();

            expect(element.text()).toContain('There are no pull requests created by you');
        });
    });

    describe('Assigned mode', () => {
        beforeEach(() => {
            localStorageService.set(ConfigObject.USER, 'anna.kowalsky');
        });

        it('should render list of pull requests', () => {
            element = $compile('<pull-requests-list></pull-requests-list>')($scope);
            $scope.$digest();

            let childPullRequest = element.find('.pull-requests-list.assigned pull-request');

            expect(childPullRequest.length).toEqual(2);
            expect(childPullRequest.attr('mode')).toEqual('ASSIGNED');
        });

        it('should update pull requests list when pull requests repository changes', () => {
            element = $compile('<pull-requests-list></pull-requests-list>')($scope);
            $scope.$digest();

            let childPullRequest = element.find('.pull-requests-list.assigned pull-request');

            expect(childPullRequest.length).toEqual(2);

            let loggedInUser = new User();
            loggedInUser.username = 'anna.kowalsky';
            let loggedInReviewer = new Reviewer();
            loggedInReviewer.user = loggedInUser;
            loggedInReviewer.approved = false;

            let newPullRequest: PullRequest = new PullRequest();
            newPullRequest.reviewers.push(loggedInReviewer);

            pullRequestRepository.pullRequests.push(newPullRequest);
            $scope.$digest();

            childPullRequest = element.find('.pull-requests-list.assigned pull-request');
            expect(childPullRequest.length).toEqual(3);
        });

        it('should display proper message when pull requests list is empty', () => {
            pullRequestRepository.pullRequests = [];

            element = $compile('<pull-requests-list></pull-requests-list>')($scope);
            $scope.$digest();

            expect(element.text()).toContain('There are no pull requests assigned to you');
        });
    });
});
