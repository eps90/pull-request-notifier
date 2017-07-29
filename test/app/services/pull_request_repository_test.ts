import {PullRequestRepository} from "../../../app/services/pull_request_repository";
import {ChromeExtensionEvent, Project, PullRequest, Reviewer, User} from "../../../app/services/models";
import * as angular from 'angular';

describe('PullRequestRepository', () => {
    var pullRequestRepositoryOne: PullRequestRepository,
        pullRequestRepositoryTwo: PullRequestRepository,
        messageFunc, connectionFunc, connectPort, connectPortFn;

    beforeEach(() => {
        connectPort = {
            onMessage: {
                addListener: jasmine.createSpy('port.onMessage.addListener').and.callFake((fn) => {
                    connectPortFn = fn;
                })
            }
        };
        window['chrome'] = {
            extension: {
                connect: jasmine.createSpy('chrome.extension.connect').and.returnValue(connectPort),
                sendMessage: jasmine.createSpy('chrome.extension.sendMessage'),
                onMessage: {
                    addListener: jasmine.createSpy('chrome.extension.onMessage.addListener').and.callFake((fn) => {
                        messageFunc = fn;
                    })
                },
                onConnect: {
                    addListener: jasmine.createSpy('chrome.extension.onConnect.addListener').and.callFake((fn) => {
                        connectionFunc = fn;
                    })
                }
            }
        };
    });
    beforeEach(angular.mock.module('bitbucketNotifier'));
    beforeEach(inject([
        'PullRequestRepository',
        'PullRequestRepository',
        ($s1, $s2) => {
            pullRequestRepositoryOne = $s1;
            pullRequestRepositoryTwo = $s2;
        }
    ]));

    it('should keep the same value each time', () => {
        var pullRequestOne: PullRequest = new PullRequest();
        var pullRequestTwo: PullRequest = new PullRequest();

        pullRequestRepositoryOne.pullRequests = [pullRequestOne];
        pullRequestRepositoryTwo.pullRequests.push(pullRequestTwo);

        expect(pullRequestRepositoryOne.pullRequests === pullRequestRepositoryTwo.pullRequests);
    });

    it('should set the list of pull requests', () => {
        expect(pullRequestRepositoryOne.pullRequests.length).toBe(0);

        var pullRequest: PullRequest = new PullRequest();
        var pullRequestsList = [pullRequest];

        pullRequestRepositoryOne.setPullRequests(pullRequestsList);

        expect(pullRequestRepositoryOne.pullRequests.length).toBe(1);
    });

    it('should be able to detect new assignment', () => {
        var project = new Project();
        project.fullName = 'team_name/repo_name';

        var user = new User();
        user.username = 'john.smith';
        var reviewer = new Reviewer();
        reviewer.user = user;
        reviewer.approved = false;

        var pullRequest: PullRequest = new PullRequest();
        pullRequest.id = 1;
        pullRequest.targetRepository = project;
        pullRequest.reviewers = [];

        var changedPullRequest: PullRequest = new PullRequest();
        changedPullRequest.id = 1;
        changedPullRequest.targetRepository = project;
        changedPullRequest.reviewers = [reviewer];

        pullRequestRepositoryOne.pullRequests = [pullRequest];
        var actual: boolean = pullRequestRepositoryOne.hasAssignmentChanged(changedPullRequest);
        expect(actual).toBeTruthy();
    });

    it('should be able to detect when user is assigned', () => {
        var project = new Project();
        project.fullName = 'team_name/repo_name';

        var user = new User();
        user.username = 'john.smith';
        var newUser = new User();
        newUser.username = 'anna.kowalsky';

        var reviewer = new Reviewer();
        reviewer.user = user;
        reviewer.approved = false;
        var newReviewer = new Reviewer();
        newReviewer.user = newUser;
        newReviewer.approved = false;

        var pullRequest: PullRequest = new PullRequest();
        pullRequest.id = 1;
        pullRequest.targetRepository = project;
        pullRequest.reviewers = [reviewer];

        var changedPullRequest: PullRequest = new PullRequest();
        changedPullRequest.id = 1;
        changedPullRequest.targetRepository = project;
        changedPullRequest.reviewers = [newReviewer];

        pullRequestRepositoryOne.pullRequests = [pullRequest];
        var actual: boolean = pullRequestRepositoryOne.hasAssignmentChanged(changedPullRequest);
        expect(actual).toBeTruthy();
    });

    it('should determine whether given pull request already exists', () => {
        var existentPullRequest = new PullRequest();
        existentPullRequest.id = 1;
        existentPullRequest.targetRepository.fullName = 'team_name/repo_name';

        var newPullRequest = new PullRequest();
        newPullRequest.id = 2;
        newPullRequest.targetRepository.fullName = 'team_name/repo_name';

        var anotherNewPullRequest = new PullRequest();
        anotherNewPullRequest.id = 1;
        anotherNewPullRequest.targetRepository.fullName = 'another_team/another_repo';

        pullRequestRepositoryOne.pullRequests = [existentPullRequest];

        expect(pullRequestRepositoryOne.exists(existentPullRequest)).toBeTruthy();
        expect(pullRequestRepositoryOne.exists(newPullRequest)).toBeFalsy();
        expect(pullRequestRepositoryOne.exists(anotherNewPullRequest)).toBeFalsy();
    });

    describe('finding pull request', () => {
        it('should find pull request by id and repository name', () => {
            var repositoryName = 'team_name/repo_name';
            var prId = 3;

            var project = new Project();
            project.fullName = repositoryName;

            var pullRequest = new PullRequest();
            pullRequest.targetRepository = project;
            pullRequest.id = prId;

            pullRequestRepositoryOne.pullRequests = [pullRequest];

            var actual: PullRequest = pullRequestRepositoryOne.find(repositoryName, prId);
            expect(actual).toEqual(pullRequest);
        });

        it('should return null if pull request has not been found', () => {
            var repositoryName = 'team_name/repo_name';
            var prId = 3;

            pullRequestRepositoryOne.pullRequests = [];

            var actual: PullRequest = pullRequestRepositoryOne.find(repositoryName, prId);
            expect(actual).toBeNull();
        });
    });

    describe('with chrome events', () => {
        it('should emit chrome event on pull request collection change', () => {
            var pullRequest: PullRequest = new PullRequest();
            var pullRequestsList = [pullRequest];

            pullRequestRepositoryOne.setPullRequests(pullRequestsList);
            expect(window['chrome'].extension.sendMessage)
                .toHaveBeenCalledWith(
                    new ChromeExtensionEvent(
                        ChromeExtensionEvent.UPDATE_PULLREQUESTS,
                        pullRequestsList
                    )
                );
        });

        it('should listen to event to update pull requests', () => {
            var pullRequest: PullRequest = new PullRequest();
            var pullRequestsList = [pullRequest];

            expect(pullRequestRepositoryOne.pullRequests.length).toBe(0);
            messageFunc({type: ChromeExtensionEvent.UPDATE_PULLREQUESTS, content: pullRequestsList});
            expect(pullRequestRepositoryOne.pullRequests.length).toBe(1);
        });

        it('should send all pull requests on connection', () => {
            var pullRequest: PullRequest = new PullRequest();
            pullRequestRepositoryOne.pullRequests = [pullRequest];

            var port = {
                postMessage: jasmine.createSpy('port.postMessage')
            };
            connectionFunc(port);
            expect(port.postMessage).toHaveBeenCalledWith(
                new ChromeExtensionEvent(
                    ChromeExtensionEvent.UPDATE_PULLREQUESTS,
                    [pullRequest]
                )
            );
        });

        it('should receive all pull requests on connection', () => {
            var pullRequest: PullRequest = new PullRequest();
            var pullRequestsList = [pullRequest];

            expect(pullRequestRepositoryOne.pullRequests.length).toBe(0);
            connectPortFn(
                new ChromeExtensionEvent(
                    ChromeExtensionEvent.UPDATE_PULLREQUESTS,
                    pullRequestsList
                )
            );
            expect(pullRequestRepositoryOne.pullRequests.length).toBe(1);
        });
    });
});
