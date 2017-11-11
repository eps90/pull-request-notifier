import {PullRequestRepository} from '../../../app/services/pull_request_repository';
import * as angular from 'angular';
import {PullRequest} from '../../../app/models/pull_request';
import {Reviewer} from '../../../app/models/reviewer';
import {User} from '../../../app/models/user';
import {Project} from '../../../app/models/project';
import {ChromeExtensionEvent} from '../../../app/models/event/chrome_extension_event';

describe('PullRequestRepository', () => {
    let pullRequestRepositoryOne: PullRequestRepository;
    let pullRequestRepositoryTwo: PullRequestRepository;
    let messageFunc;
    let connectionFunc;
    let connectPort;
    let connectPortFn;

    beforeEach(() => {
        connectPort = {
            onMessage: {
                addListener: jasmine.createSpy('port.onMessage.addListener').and.callFake((fn) => {
                    connectPortFn = fn;
                })
            }
        };
        spyOn(chrome.runtime, 'connect').and.returnValue(connectPort);
        spyOn(chrome.runtime, 'sendMessage');
        spyOn(chrome.runtime.onMessage, 'addListener').and.callFake((fn) => messageFunc = fn);
        spyOn(chrome.runtime.onConnect, 'addListener').and.callFake((fn) => connectionFunc = fn);
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
        const pullRequestOne: PullRequest = new PullRequest();
        const pullRequestTwo: PullRequest = new PullRequest();

        pullRequestRepositoryOne.pullRequests = [pullRequestOne];
        pullRequestRepositoryTwo.pullRequests.push(pullRequestTwo);

        expect(pullRequestRepositoryOne.pullRequests === pullRequestRepositoryTwo.pullRequests);
    });

    it('should set the list of pull requests', () => {
        expect(pullRequestRepositoryOne.pullRequests.length).toBe(0);

        const pullRequest: PullRequest = new PullRequest();
        const pullRequestsList = [pullRequest];

        pullRequestRepositoryOne.setPullRequests(pullRequestsList);

        expect(pullRequestRepositoryOne.pullRequests.length).toBe(1);
    });

    it('should be able to detect new assignment', () => {
        const project = new Project();
        project.fullName = 'team_name/repo_name';

        const user = new User();
        user.username = 'john.smith';
        const reviewer = new Reviewer();
        reviewer.user = user;
        reviewer.approved = false;

        const pullRequest: PullRequest = new PullRequest();
        pullRequest.id = 1;
        pullRequest.targetRepository = project;
        pullRequest.reviewers = [];

        const changedPullRequest: PullRequest = new PullRequest();
        changedPullRequest.id = 1;
        changedPullRequest.targetRepository = project;
        changedPullRequest.reviewers = [reviewer];

        pullRequestRepositoryOne.pullRequests = [pullRequest];
        const actual: boolean = pullRequestRepositoryOne.hasAssignmentChanged(changedPullRequest);
        expect(actual).toBeTruthy();
    });

    it('should be able to detect when user is assigned', () => {
        const project = new Project();
        project.fullName = 'team_name/repo_name';

        const user = new User();
        user.username = 'john.smith';
        const newUser = new User();
        newUser.username = 'anna.kowalsky';

        const reviewer = new Reviewer();
        reviewer.user = user;
        reviewer.approved = false;
        const newReviewer = new Reviewer();
        newReviewer.user = newUser;
        newReviewer.approved = false;

        const pullRequest: PullRequest = new PullRequest();
        pullRequest.id = 1;
        pullRequest.targetRepository = project;
        pullRequest.reviewers = [reviewer];

        const changedPullRequest: PullRequest = new PullRequest();
        changedPullRequest.id = 1;
        changedPullRequest.targetRepository = project;
        changedPullRequest.reviewers = [newReviewer];

        pullRequestRepositoryOne.pullRequests = [pullRequest];
        const actual: boolean = pullRequestRepositoryOne.hasAssignmentChanged(changedPullRequest);
        expect(actual).toBeTruthy();
    });

    it('should determine whether given pull request already exists', () => {
        const existentPullRequest = new PullRequest();
        existentPullRequest.id = 1;
        existentPullRequest.targetRepository.fullName = 'team_name/repo_name';

        const newPullRequest = new PullRequest();
        newPullRequest.id = 2;
        newPullRequest.targetRepository.fullName = 'team_name/repo_name';

        const anotherNewPullRequest = new PullRequest();
        anotherNewPullRequest.id = 1;
        anotherNewPullRequest.targetRepository.fullName = 'another_team/another_repo';

        pullRequestRepositoryOne.pullRequests = [existentPullRequest];

        expect(pullRequestRepositoryOne.exists(existentPullRequest)).toBeTruthy();
        expect(pullRequestRepositoryOne.exists(newPullRequest)).toBeFalsy();
        expect(pullRequestRepositoryOne.exists(anotherNewPullRequest)).toBeFalsy();
    });

    describe('finding pull request', () => {
        it('should find pull request by id and repository name', () => {
            const repositoryName = 'team_name/repo_name';
            const prId = 3;

            const project = new Project();
            project.fullName = repositoryName;

            const pullRequest = new PullRequest();
            pullRequest.targetRepository = project;
            pullRequest.id = prId;

            pullRequestRepositoryOne.pullRequests = [pullRequest];

            const actual: PullRequest = pullRequestRepositoryOne.find(repositoryName, prId);
            expect(actual).toEqual(pullRequest);
        });

        it('should return null if pull request has not been found', () => {
            const repositoryName = 'team_name/repo_name';
            const prId = 3;

            pullRequestRepositoryOne.pullRequests = [];

            const actual: PullRequest = pullRequestRepositoryOne.find(repositoryName, prId);
            expect(actual).toBeNull();
        });
    });

    describe('with chrome events', () => {
        it('should emit chrome event on pull request collection change', () => {
            const pullRequest: PullRequest = new PullRequest();
            const pullRequestsList = [pullRequest];

            pullRequestRepositoryOne.setPullRequests(pullRequestsList);
            expect(chrome.runtime.sendMessage)
                .toHaveBeenCalledWith(
                    new ChromeExtensionEvent(
                        ChromeExtensionEvent.UPDATE_PULLREQUESTS,
                        pullRequestsList
                    )
                );
        });

        it('should listen to event to update pull requests', () => {
            const pullRequest: PullRequest = new PullRequest();
            const pullRequestsList = [pullRequest];

            expect(pullRequestRepositoryOne.pullRequests.length).toBe(0);
            messageFunc({type: ChromeExtensionEvent.UPDATE_PULLREQUESTS, content: pullRequestsList});
            expect(pullRequestRepositoryOne.pullRequests.length).toBe(1);
        });

        it('should send all pull requests on connection', () => {
            const pullRequest: PullRequest = new PullRequest();
            pullRequestRepositoryOne.pullRequests = [pullRequest];

            const port = {
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
            const pullRequest: PullRequest = new PullRequest();
            const pullRequestsList = [pullRequest];

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
