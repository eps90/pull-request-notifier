import {PullRequestRepository} from '../../../app/services/pull_request_repository';
import * as angular from 'angular';
import {PullRequest} from '../../../app/models/pull_request';
import {Reviewer} from '../../../app/models/reviewer';
import {User} from '../../../app/models/user';
import {Project} from '../../../app/models/project';
import {ChromeExtensionEvent} from '../../../app/models/event/chrome_extension_event';

describe('PullRequestRepository', () => {
    let pullRequestRepositoryOne: PullRequestRepository,
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
        let pullRequestOne: PullRequest = new PullRequest();
        let pullRequestTwo: PullRequest = new PullRequest();

        pullRequestRepositoryOne.pullRequests = [pullRequestOne];
        pullRequestRepositoryTwo.pullRequests.push(pullRequestTwo);

        expect(pullRequestRepositoryOne.pullRequests === pullRequestRepositoryTwo.pullRequests);
    });

    it('should set the list of pull requests', () => {
        expect(pullRequestRepositoryOne.pullRequests.length).toBe(0);

        let pullRequest: PullRequest = new PullRequest();
        let pullRequestsList = [pullRequest];

        pullRequestRepositoryOne.setPullRequests(pullRequestsList);

        expect(pullRequestRepositoryOne.pullRequests.length).toBe(1);
    });

    it('should be able to detect new assignment', () => {
        let project = new Project();
        project.fullName = 'team_name/repo_name';

        let user = new User();
        user.username = 'john.smith';
        let reviewer = new Reviewer();
        reviewer.user = user;
        reviewer.approved = false;

        let pullRequest: PullRequest = new PullRequest();
        pullRequest.id = 1;
        pullRequest.targetRepository = project;
        pullRequest.reviewers = [];

        let changedPullRequest: PullRequest = new PullRequest();
        changedPullRequest.id = 1;
        changedPullRequest.targetRepository = project;
        changedPullRequest.reviewers = [reviewer];

        pullRequestRepositoryOne.pullRequests = [pullRequest];
        let actual: boolean = pullRequestRepositoryOne.hasAssignmentChanged(changedPullRequest);
        expect(actual).toBeTruthy();
    });

    it('should be able to detect when user is assigned', () => {
        let project = new Project();
        project.fullName = 'team_name/repo_name';

        let user = new User();
        user.username = 'john.smith';
        let newUser = new User();
        newUser.username = 'anna.kowalsky';

        let reviewer = new Reviewer();
        reviewer.user = user;
        reviewer.approved = false;
        let newReviewer = new Reviewer();
        newReviewer.user = newUser;
        newReviewer.approved = false;

        let pullRequest: PullRequest = new PullRequest();
        pullRequest.id = 1;
        pullRequest.targetRepository = project;
        pullRequest.reviewers = [reviewer];

        let changedPullRequest: PullRequest = new PullRequest();
        changedPullRequest.id = 1;
        changedPullRequest.targetRepository = project;
        changedPullRequest.reviewers = [newReviewer];

        pullRequestRepositoryOne.pullRequests = [pullRequest];
        let actual: boolean = pullRequestRepositoryOne.hasAssignmentChanged(changedPullRequest);
        expect(actual).toBeTruthy();
    });

    it('should determine whether given pull request already exists', () => {
        let existentPullRequest = new PullRequest();
        existentPullRequest.id = 1;
        existentPullRequest.targetRepository.fullName = 'team_name/repo_name';

        let newPullRequest = new PullRequest();
        newPullRequest.id = 2;
        newPullRequest.targetRepository.fullName = 'team_name/repo_name';

        let anotherNewPullRequest = new PullRequest();
        anotherNewPullRequest.id = 1;
        anotherNewPullRequest.targetRepository.fullName = 'another_team/another_repo';

        pullRequestRepositoryOne.pullRequests = [existentPullRequest];

        expect(pullRequestRepositoryOne.exists(existentPullRequest)).toBeTruthy();
        expect(pullRequestRepositoryOne.exists(newPullRequest)).toBeFalsy();
        expect(pullRequestRepositoryOne.exists(anotherNewPullRequest)).toBeFalsy();
    });

    describe('finding pull request', () => {
        it('should find pull request by id and repository name', () => {
            let repositoryName = 'team_name/repo_name';
            let prId = 3;

            let project = new Project();
            project.fullName = repositoryName;

            let pullRequest = new PullRequest();
            pullRequest.targetRepository = project;
            pullRequest.id = prId;

            pullRequestRepositoryOne.pullRequests = [pullRequest];

            let actual: PullRequest = pullRequestRepositoryOne.find(repositoryName, prId);
            expect(actual).toEqual(pullRequest);
        });

        it('should return null if pull request has not been found', () => {
            let repositoryName = 'team_name/repo_name';
            let prId = 3;

            pullRequestRepositoryOne.pullRequests = [];

            let actual: PullRequest = pullRequestRepositoryOne.find(repositoryName, prId);
            expect(actual).toBeNull();
        });
    });

    describe('with chrome events', () => {
        it('should emit chrome event on pull request collection change', () => {
            let pullRequest: PullRequest = new PullRequest();
            let pullRequestsList = [pullRequest];

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
            let pullRequest: PullRequest = new PullRequest();
            let pullRequestsList = [pullRequest];

            expect(pullRequestRepositoryOne.pullRequests.length).toBe(0);
            messageFunc({type: ChromeExtensionEvent.UPDATE_PULLREQUESTS, content: pullRequestsList});
            expect(pullRequestRepositoryOne.pullRequests.length).toBe(1);
        });

        it('should send all pull requests on connection', () => {
            let pullRequest: PullRequest = new PullRequest();
            pullRequestRepositoryOne.pullRequests = [pullRequest];

            let port = {
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
            let pullRequest: PullRequest = new PullRequest();
            let pullRequestsList = [pullRequest];

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
