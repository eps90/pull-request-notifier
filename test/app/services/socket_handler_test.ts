///<reference path="../../../app/_typings.ts"/>

describe('SocketHandler', () => {
    var socketHandler,
        socketManager: BitbucketNotifier.SocketManager,
        config: BitbucketNotifier.Config,
        pullRequestRepository: BitbucketNotifier.PullRequestRepository,
        notifier: BitbucketNotifier.Notifier,
        indicator: BitbucketNotifier.Indicator,
        hasAssignmentChanged = false,
        exists = true,
        extensionListener: Function;

    beforeEach(module('bitbucketNotifier.background'));
    beforeEach(module(['$provide', ($p: ng.auto.IProvideService) => {
        $p.value('Notifier', {
            notifyNewPullRequestAssigned: jasmine.createSpy('notifyNewPullRequestAssigned'),
            notifyPullRequestMerged: jasmine.createSpy('notifyPullRequestMerged'),
            notifyPullRequestApproved: jasmine.createSpy('notifyPullRequestApproved'),
            notifyReminder: jasmine.createSpy('notifyReminder'),
            notifyPullRequestUpdated: jasmine.createSpy('notifyPullRequestUpdated'),
            notifyNewCommentAdded: jasmine.createSpy('notifyNewCommentAdded'),
            notifyNewReplyOnComment: jasmine.createSpy('notifyNewReplyOnComment')
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
                }),
            exists: jasmine.createSpy('PullRequestRepository.exists')
                .and.callFake(() => {
                    return exists;
                })
        });

        window['chrome'] = {
            extension: {
                onMessage: {
                    addListener: jasmine.createSpy('chrome.extension.onMessage.addListener').and.callFake((fn) => {
                        extensionListener = fn;
                    })
                }
            }
        };
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

    it('should emit client:remind on chrome event', () => {
        var pullRequest = new BitbucketNotifier.PullRequest();
        var chromeEvent = new BitbucketNotifier.ChromeExtensionEvent(
            BitbucketNotifier.ChromeExtensionEvent.REMIND,
            pullRequest
        );

        extensionListener(chromeEvent);
        expect(socketManager.socket.emits).toEqual({'client:remind': [[pullRequest]]});
    });

    describe('chrome notifications', () => {
        var pullRequestEvent: BitbucketNotifier.PullRequestEvent;
        var pullRequest: BitbucketNotifier.PullRequest;
        var pullRequestsList;
        var johnSmith: BitbucketNotifier.User;
        var annaKowalsky: BitbucketNotifier.User;

        beforeEach(() => {
            pullRequest = new BitbucketNotifier.PullRequest();
            pullRequest.id = 1;
            pullRequest.targetRepository.fullName = 'team_name/repo_name';

            pullRequestsList = [pullRequest];

            pullRequestEvent = new BitbucketNotifier.PullRequestEvent();
            pullRequestEvent.pullRequests = pullRequestsList;
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

            it('should not notify about assigned pull requests when author already approved a PullRequest', () => {
                var unapprovedReviewer = new BitbucketNotifier.Reviewer();
                unapprovedReviewer.user = johnSmith;
                unapprovedReviewer.approved = false;

                var approvedReviewer = new BitbucketNotifier.Reviewer();
                approvedReviewer.user = johnSmith;
                approvedReviewer.approved = true;

                pullRequest.reviewers.push(unapprovedReviewer);

                var approvedPullRequest = new BitbucketNotifier.PullRequest();
                approvedPullRequest.id = 2;
                approvedPullRequest.targetRepository.fullName = 'team_name/repo_name';
                approvedPullRequest.reviewers.push(approvedReviewer);

                pullRequestsList.push(approvedPullRequest);

                socketManager.socket.receive(BitbucketNotifier.SocketServerEvent.INTRODUCED, pullRequestEvent);

                expect(notifier.notifyNewPullRequestAssigned).toHaveBeenCalledWith(pullRequest);
                expect(notifier.notifyNewPullRequestAssigned).not.toHaveBeenCalledWith(approvedPullRequest);
            });
        });

        describe('on updated pull request', () => {
            it('should notify about new assignment when assignment has changed and pull request has not been already indexed', () => {
                pullRequestEvent.sourceEvent = BitbucketNotifier.WebhookEvent.PULLREQUEST_UPDATED;
                hasAssignmentChanged = true;
                exists = false;

                var loggedInReviewer = new BitbucketNotifier.Reviewer();
                loggedInReviewer.user = johnSmith;
                loggedInReviewer.approved = false;

                pullRequest.reviewers.push(loggedInReviewer);

                socketManager.socket.receive(BitbucketNotifier.SocketServerEvent.PULLREQUESTS_UPDATED, pullRequestEvent);
                expect(notifier.notifyNewPullRequestAssigned).toHaveBeenCalledWith(pullRequest);
            });

            it('should notify about pull request update when pull request has been updated', () => {
                socketManager.socket.receive(BitbucketNotifier.SocketServerEvent.PULLREQUEST_UPDATED, pullRequest);
                expect(notifier.notifyPullRequestUpdated).toHaveBeenCalledWith(pullRequest);
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

        describe('on reminder', () => {
            it('should notify assignee with reminder about pull request', () => {
                socketManager.socket.receive(BitbucketNotifier.SocketServerEvent.REMIND, pullRequest);
                expect(notifier.notifyReminder).toHaveBeenCalledWith(pullRequest);
            });
        });

        describe('on comments', () => {
            it('should notify assignee about new comment under his pull request', () => {
                pullRequest.author = annaKowalsky;
                pullRequestEvent.actor = johnSmith;
                socketManager.socket.receive(BitbucketNotifier.SocketServerEvent.NEW_COMMENT, pullRequestEvent);

                expect(notifier.notifyNewCommentAdded).toHaveBeenCalledWith(pullRequest, johnSmith);
            });

            it('should notify user about new comment reply', () => {
                pullRequest.author = annaKowalsky;
                pullRequestEvent.actor = johnSmith;
                socketManager.socket.receive(BitbucketNotifier.SocketServerEvent.NEW_REPLY_FOR_COMMENT, pullRequestEvent);

                expect(notifier.notifyNewReplyOnComment).toHaveBeenCalledWith(pullRequest, johnSmith);
            });
        })
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
