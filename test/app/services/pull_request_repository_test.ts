///<reference path="../../../app/_typings.ts"/>

describe('PullRequestRepository', () => {
    var pullRequestRepositoryOne: BitbucketNotifier.PullRequestRepository,
        pullRequestRepositoryTwo: BitbucketNotifier.PullRequestRepository,
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
    beforeEach(module('bitbucketNotifier'));
    beforeEach(inject([
        'PullRequestRepository',
        'PullRequestRepository',
        ($s1, $s2) => {
            pullRequestRepositoryOne = $s1;
            pullRequestRepositoryTwo = $s2;
        }
    ]));

    it('should keep the same value each time', () => {
        var pullRequestOne: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
        var pullRequestTwo: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();

        pullRequestRepositoryOne.pullRequests = [pullRequestOne];
        pullRequestRepositoryTwo.pullRequests.push(pullRequestTwo);

        expect(pullRequestRepositoryOne.pullRequests === pullRequestRepositoryTwo.pullRequests);
    });

    it('should set the list of pull requests', () => {
        expect(pullRequestRepositoryOne.pullRequests.length).toBe(0);

        var pullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
        var pullRequestsList = [pullRequest];

        pullRequestRepositoryOne.setPullRequests(pullRequestsList);

        expect(pullRequestRepositoryOne.pullRequests.length).toBe(1);
    });

    it('should be able to detect new assignment', () => {
        var project = new BitbucketNotifier.Project();
        project.fullName = 'team_name/repo_name';

        var user = new BitbucketNotifier.User();
        user.username = 'john.smith';
        var reviewer = new BitbucketNotifier.Reviewer();
        reviewer.user = user;
        reviewer.approved = false;

        var pullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
        pullRequest.id = 1;
        pullRequest.targetRepository = project;
        pullRequest.reviewers = [];

        var changedPullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
        changedPullRequest.id = 1;
        changedPullRequest.targetRepository = project;
        changedPullRequest.reviewers = [reviewer];

        pullRequestRepositoryOne.pullRequests = [pullRequest];
        var actual: boolean = pullRequestRepositoryOne.hasAssignmentChanged(changedPullRequest);
        expect(actual).toBeTruthy();
    });

    it('should be able to detect when user is assigned', () => {
        var project = new BitbucketNotifier.Project();
        project.fullName = 'team_name/repo_name';

        var user = new BitbucketNotifier.User();
        user.username = 'john.smith';
        var newUser = new BitbucketNotifier.User();
        newUser.username = 'anna.kowalsky';

        var reviewer = new BitbucketNotifier.Reviewer();
        reviewer.user = user;
        reviewer.approved = false;
        var newReviewer = new BitbucketNotifier.Reviewer();
        newReviewer.user = newUser;
        newReviewer.approved = false;

        var pullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
        pullRequest.id = 1;
        pullRequest.targetRepository = project;
        pullRequest.reviewers = [reviewer];

        var changedPullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
        changedPullRequest.id = 1;
        changedPullRequest.targetRepository = project;
        changedPullRequest.reviewers = [newReviewer];

        pullRequestRepositoryOne.pullRequests = [pullRequest];
        var actual: boolean = pullRequestRepositoryOne.hasAssignmentChanged(changedPullRequest);
        expect(actual).toBeTruthy();
    });

    describe('with chrome events', () => {
        it('should emit chrome event on pull request collection change', () => {
            var pullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
            var pullRequestsList = [pullRequest];

            pullRequestRepositoryOne.setPullRequests(pullRequestsList);
            expect(window['chrome'].extension.sendMessage)
                .toHaveBeenCalledWith(
                    new BitbucketNotifier.ChromeExtensionEvent(
                        BitbucketNotifier.ChromeExtensionEvent.UPDATE_PULLREQUESTS,
                        pullRequestsList
                    )
                );
        });

        it('should listen to event to update pull requests', () => {
            var pullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
            var pullRequestsList = [pullRequest];

            expect(pullRequestRepositoryOne.pullRequests.length).toBe(0);
            messageFunc({type: BitbucketNotifier.ChromeExtensionEvent.UPDATE_PULLREQUESTS, content: pullRequestsList});
            expect(pullRequestRepositoryOne.pullRequests.length).toBe(1);
        });

        it('should send all pull requests on connection', () => {
            var pullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
            pullRequestRepositoryOne.pullRequests = [pullRequest];

            var port = {
                postMessage: jasmine.createSpy('port.postMessage')
            };
            connectionFunc(port);
            expect(port.postMessage).toHaveBeenCalledWith(
                new BitbucketNotifier.ChromeExtensionEvent(
                    BitbucketNotifier.ChromeExtensionEvent.UPDATE_PULLREQUESTS,
                    [pullRequest]
                )
            );
        });

        it('should receive all pull requests on connection', () => {
            var pullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
            var pullRequestsList = [pullRequest];

            expect(pullRequestRepositoryOne.pullRequests.length).toBe(0);
            connectPortFn(
                new BitbucketNotifier.ChromeExtensionEvent(
                    BitbucketNotifier.ChromeExtensionEvent.UPDATE_PULLREQUESTS,
                    pullRequestsList
                )
            );
            expect(pullRequestRepositoryOne.pullRequests.length).toBe(1);
        });
    });
});
