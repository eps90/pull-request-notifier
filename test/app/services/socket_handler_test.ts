///<reference path="../../../app/_typings.ts"/>

describe('SocketHandler', () => {
    var socketHandler,
        socketManager: BitbucketNotifier.SocketManager,
        config: BitbucketNotifier.Config,
        pullRequestRepository: BitbucketNotifier.PullRequestRepository,
        notifier: BitbucketNotifier.Notifier,
        indicator: BitbucketNotifier.Indicator,
        hasAssignmentChanged = false;

    beforeEach(module('bitbucketNotifier.background'));
    beforeEach(module(['$provide', ($p: ng.auto.IProvideService) => {
        $p.value('Notifier', {
            notifyNewPullRequestAssigned: jasmine.createSpy('notifyNewPullRequestAssigned'),
            notifyPullRequestMerged: jasmine.createSpy('notifyPullRequestMerged'),
            notifyPullRequestApproved: jasmine.createSpy('notifyPullRequestApproved')
        });

        $p.value('Config', {
            getUsername: jasmine.createSpy('getUsername').and.callFake(() => {
                return 'john.smith';
            }),
            getSocketServerAddress: jasmine.createSpy('getSocketServerAddress').and.callFake(() => {
                return 'http://localhost:1234';
            })
        });

        $p.value('Indicator', {
            reset: jasmine.createSpy('Indicator.reset'),
            setText: jasmine.createSpy('Indicator.setText')
        });

        $p.value('PullRequestRepository', {
            pullRequests: [],
            setPullRequests: jasmine.createSpy('PullRequestRepository.setpullRequests')
                .and.callFake((pullRequests: BitbucketNotifier.PullRequest[]) => {
                    this.pullRequests = pullRequests;
                }),
            hasAssignmentChanged: jasmine.createSpy('PullRequestRepository.hasAssignmentChanged')
                .and.callFake(() => {
                    return hasAssignmentChanged;
                })
        });
    }]));
    beforeEach(inject([
        'SocketHandler',
        'SocketManager',
        'Config',
        'PullRequestRepository',
        'Notifier',
        'Indicator',
        (sh, s, c, prr, n, i) => {
            socketHandler = sh;
            socketManager = s;
            config = c;
            pullRequestRepository = prr;
            notifier = n;
            indicator = i;
        }
    ]));

    it('should emit client:introduce event with logged in user, on connection', () => {
        socketManager.socket.receive('connect');
        expect(socketManager.socket.emits).toEqual(jasmine.objectContaining({'client:introduce': jasmine.anything()}));
        expect(socketManager.socket.emits[BitbucketNotifier.SocketClientEvent.INTRODUCE][0]).toEqual(['john.smith']);
    });

    it('should update pull request repository on server:pullrequests:updated', () => {
        var pullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
        var userPullRequest: BitbucketNotifier.PullRequestEvent = new BitbucketNotifier.PullRequestEvent();
        userPullRequest.sourceEvent = 'pullrequest:created';
        userPullRequest.pullRequests = [pullRequest];
        userPullRequest.context = pullRequest;

        socketManager.socket.receive(BitbucketNotifier.SocketServerEvent.PULLREQUESTS_UPDATED, userPullRequest);

        expect(pullRequestRepository.setPullRequests).toHaveBeenCalledWith([pullRequest]);
    });

    it('should clean pull request repository on disconnection', () => {
        socketManager.socket.receive('disconnect');
        expect(pullRequestRepository.setPullRequests).toHaveBeenCalledWith([]);
    });

    describe('chrome notifications', () => {
        var pullRequestEvent: BitbucketNotifier.PullRequestEvent;
        var pullRequest: BitbucketNotifier.PullRequest;
        var johnSmith: BitbucketNotifier.User;
        var annaKowalsky: BitbucketNotifier.User;

        beforeEach(() => {
            pullRequest = new BitbucketNotifier.PullRequest();
            pullRequest.id = 1;
            pullRequest.targetRepository.fullName = 'team_name/repo_name';

            pullRequestEvent = new BitbucketNotifier.PullRequestEvent();
            pullRequestEvent.pullRequests = [pullRequest];
            pullRequestEvent.context = pullRequest;

            johnSmith = new BitbucketNotifier.User();
            johnSmith.username = 'john.smith';
            johnSmith.displayName = 'John Smith';

            annaKowalsky = new BitbucketNotifier.User();
            annaKowalsky.displayName = 'Anna Kowalsky';
            annaKowalsky.username = 'anna.kowalsky';
        });

        describe('on introduce', () => {
            it('should notify about author\'s pull requests', () => {
                var loggedInReviewer = new BitbucketNotifier.Reviewer();
                loggedInReviewer.user = johnSmith;
                loggedInReviewer.approved = false;

                pullRequest.reviewers.push(loggedInReviewer);

                socketManager.socket.receive(BitbucketNotifier.SocketServerEvent.INTRODUCED, pullRequestEvent);
                var stub: jasmine.Spy = <jasmine.Spy> notifier.notifyNewPullRequestAssigned;
                expect(stub.calls.count()).toEqual(1);
            });
        });

        describe('on updated pull request', () => {
            it('should notify about new assignment when assignment has changed', () => {
                pullRequestEvent.sourceEvent = BitbucketNotifier.WebhookEvent.PULLREQUEST_UPDATED;
                hasAssignmentChanged = true;

                var loggedInReviewer = new BitbucketNotifier.Reviewer();
                loggedInReviewer.user = johnSmith;
                loggedInReviewer.approved = false;

                pullRequest.reviewers.push(loggedInReviewer);

                socketManager.socket.receive(BitbucketNotifier.SocketServerEvent.PULLREQUESTS_UPDATED, pullRequestEvent);
                expect(notifier.notifyNewPullRequestAssigned).toHaveBeenCalledWith(pullRequest);
            });
        });

        describe('on new pull request', () => {
            it('should notify about new pull request assignment on webhook:pullrequest:created', () => {
                pullRequestEvent.sourceEvent = BitbucketNotifier.WebhookEvent.PULLREQUEST_CREATED;

                var loggedInReviewer = new BitbucketNotifier.Reviewer();
                loggedInReviewer.user = johnSmith;
                loggedInReviewer.approved = false;

                pullRequest.author = annaKowalsky;
                pullRequest.reviewers.push(loggedInReviewer);

                socketManager.socket.receive(BitbucketNotifier.SocketServerEvent.PULLREQUESTS_UPDATED, pullRequestEvent);
                expect(notifier.notifyNewPullRequestAssigned).toHaveBeenCalledWith(pullRequest);
            });

            it('should not notify about new pull request on webhook:pullrequest:created, if author is assigned user', () => {
                pullRequestEvent.sourceEvent = BitbucketNotifier.WebhookEvent.PULLREQUEST_CREATED;
                pullRequest.author = johnSmith;

                socketManager.socket.receive(BitbucketNotifier.SocketServerEvent.PULLREQUESTS_UPDATED, pullRequestEvent);
                expect(notifier.notifyNewPullRequestAssigned).not.toHaveBeenCalled();
            });

            it('should not notify about new pull request on other event than pull:request:created', () => {
                pullRequestEvent.sourceEvent = 'webhook:pullrequest:fulfilled';

                var loggedInReviewer = new BitbucketNotifier.Reviewer();
                loggedInReviewer.user = johnSmith;
                loggedInReviewer.approved = false;

                pullRequest.author = annaKowalsky;
                pullRequest.reviewers.push(loggedInReviewer);

                socketManager.socket.receive(BitbucketNotifier.SocketServerEvent.PULLREQUESTS_UPDATED, pullRequestEvent);
                expect(notifier.notifyNewPullRequestAssigned).not.toHaveBeenCalled();
            });
        });

        describe('on merged pull request', () => {
            it('should notify author about merged pull request on webhook:pullrequest:fulfilled event', () => {
                pullRequestEvent.sourceEvent = BitbucketNotifier.WebhookEvent.PULLREQUEST_FULFILLED;
                pullRequest.author = johnSmith;

                socketManager.socket.receive(BitbucketNotifier.SocketServerEvent.PULLREQUESTS_UPDATED, pullRequestEvent);
                expect(notifier.notifyPullRequestMerged).toHaveBeenCalledWith(pullRequest);
            });

            it('should not notify about merged pull request on webhook:pullrequest:fulfilled event, if user is a reviewer', () => {
                pullRequestEvent.sourceEvent = BitbucketNotifier.WebhookEvent.PULLREQUEST_FULFILLED;
                pullRequest.author = annaKowalsky;

                var loggedInReviewer = new BitbucketNotifier.Reviewer();
                loggedInReviewer.user = johnSmith;
                loggedInReviewer.approved = false;
                pullRequest.reviewers.push(loggedInReviewer);

                socketManager.socket.receive(BitbucketNotifier.SocketServerEvent.PULLREQUESTS_UPDATED, pullRequestEvent);
                expect(notifier.notifyPullRequestMerged).not.toHaveBeenCalled();
            });
        });

        describe('on approval', () => {
            it('should notify author of pull request about approval', () => {
                pullRequestEvent.sourceEvent = BitbucketNotifier.WebhookEvent.PULLREQUEST_APPROVED;
                pullRequest.author = johnSmith;
                pullRequestEvent.actor = annaKowalsky;

                socketManager.socket.receive(BitbucketNotifier.SocketServerEvent.PULLREQUESTS_UPDATED, pullRequestEvent);
                expect(notifier.notifyPullRequestApproved).toHaveBeenCalledWith(pullRequest, annaKowalsky);
            });

            it('should not notify logged in user about approval, if he is not the author of this PR', () => {
                pullRequestEvent.sourceEvent = BitbucketNotifier.WebhookEvent.PULLREQUEST_APPROVED;
                pullRequest.author = annaKowalsky;
                pullRequestEvent.actor = johnSmith;

                socketManager.socket.receive(BitbucketNotifier.SocketServerEvent.PULLREQUESTS_UPDATED, pullRequestEvent);
                expect(notifier.notifyPullRequestApproved).not.toHaveBeenCalled();
            });
        });
    });

    describe('indicator state', () => {
        it('should show number of pull requests on introduced event', () => {
            var pullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
            var pullRequestEvent: BitbucketNotifier.PullRequestEvent = new BitbucketNotifier.PullRequestEvent();
            pullRequestRepository.pullRequests = [pullRequest];

            socketManager.socket.receive(BitbucketNotifier.SocketServerEvent.INTRODUCED, pullRequestEvent);
            expect(indicator.setText).toHaveBeenCalledWith('1');
        });

        it('should show number of pull requests on pullrequest updated event', () => {
            var pullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
            var pullRequestEvent: BitbucketNotifier.PullRequestEvent = new BitbucketNotifier.PullRequestEvent();
            pullRequestRepository.pullRequests = [pullRequest];

            socketManager.socket.receive(BitbucketNotifier.SocketServerEvent.PULLREQUESTS_UPDATED, pullRequestEvent);
            expect(indicator.setText).toHaveBeenCalledWith('1');
        });

        it('should bring back default badge text on disconnection', () => {
            var pullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
            var pullRequestEvent: BitbucketNotifier.PullRequestEvent = new BitbucketNotifier.PullRequestEvent();
            pullRequestRepository.pullRequests = [pullRequest];

            socketManager.socket.receive(BitbucketNotifier.SocketServerEvent.PULLREQUESTS_UPDATED, pullRequestEvent);
            expect(indicator.setText).toHaveBeenCalledWith('1');

            socketManager.socket.receive('disconnect');
            expect(indicator.reset).toHaveBeenCalled();
        });
    });
});
