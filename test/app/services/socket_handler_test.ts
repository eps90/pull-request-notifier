import {SocketManager} from '../../../app/services/socket_manager';
import {Notifier} from '../../../app/services/notifier';
import {PullRequestRepository} from '../../../app/services/pull_request_repository';
import {Indicator} from '../../../app/services/indicator';
import * as angular from 'angular';
import {PullRequest} from '../../../app/models/pull_request';
import {SocketClientEvent} from '../../../app/models/event/socket_client_event';
import {PullRequestEvent} from '../../../app/models/event/pull_request_event';
import {SocketServerEvent} from '../../../app/models/event/socket_server_event';
import {ChromeExtensionEvent} from '../../../app/models/event/chrome_extension_event';
import {User} from '../../../app/models/user';
import {Reviewer} from '../../../app/models/reviewer';
import {WebhookEvent} from '../../../app/models/event/webhook_event';
import {PullRequestCommentEvent} from '../../../app/models/event/pull_request_comment_event';
import {Config} from '../../../app/services/config/config';
import {ConfigProvider} from '../../../app/services/config/config_provider';
import {InMemoryConfigStorage} from '../../../app/services/config/in_memory_config_storage';
import {ConfigObject} from '../../../app/models/config_object';
require('./../../angular-socket.io-mock');

describe('SocketHandler', () => {
    let socketHandler;
    let socketManager: SocketManager;
    let config: Config;
    let pullRequestRepository: PullRequestRepository;
    let notifier: Notifier;
    let indicator: Indicator;
    let hasAssignmentChanged = false;
    let exists = true;
    let extensionListener: (chromeEvent) => void;

    beforeEach(angular.mock.module('bitbucketNotifier.background'));
    beforeEach(angular.mock.module([
        '$provide',
        'configProvider',
        ($p: ng.auto.IProvideService, configProvider: ConfigProvider) => {
            configProvider.useCustomStorage(new InMemoryConfigStorage());
            configProvider.setDefaults(new Map([
                [ConfigObject.USER, 'john.smith'],
                [ConfigObject.SOCKET_SERVER, 'http://localhost:1234'],
            ]));

            $p.value('Notifier', {
                notifyNewPullRequestAssigned: jasmine.createSpy('notifyNewPullRequestAssigned'),
                notifyPullRequestMerged: jasmine.createSpy('notifyPullRequestMerged'),
                notifyPullRequestApproved: jasmine.createSpy('notifyPullRequestApproved'),
                notifyReminder: jasmine.createSpy('notifyReminder'),
                notifyPullRequestUpdated: jasmine.createSpy('notifyPullRequestUpdated'),
                notifyNewCommentAdded: jasmine.createSpy('notifyNewCommentAdded'),
                notifyNewReplyOnComment: jasmine.createSpy('notifyNewReplyOnComment')
            });

            $p.value('Indicator', {
                reset: jasmine.createSpy('Indicator.reset'),
                setText: jasmine.createSpy('Indicator.setText')
            });

            $p.value('PullRequestRepository', {
                pullRequests: [],
                setPullRequests: jasmine.createSpy('PullRequestRepository.setpullRequests')
                    .and.callFake((pullRequests: PullRequest[]) => {
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

            spyOn(chrome.runtime.onMessage, 'addListener').and.callFake(fn => extensionListener = fn);
        }])
    );
    beforeEach(inject([
        'SocketHandler',
        'SocketManager',
        'config',
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
        expect(socketManager.socket.emits[SocketClientEvent.INTRODUCE][0]).toEqual(['john.smith']);
    });

    it('should update pull request repository on server:pullrequests:updated', () => {
        const pullRequest: PullRequest = new PullRequest();
        const userPullRequest: PullRequestEvent = new PullRequestEvent();
        userPullRequest.sourceEvent = 'pullrequest:created';
        userPullRequest.pullRequests = [pullRequest];
        userPullRequest.context = pullRequest;

        socketManager.socket.receive(SocketServerEvent.PULLREQUESTS_UPDATED, userPullRequest);

        expect(pullRequestRepository.setPullRequests).toHaveBeenCalledWith([pullRequest]);
    });

    it('should clean pull request repository on disconnection', () => {
        socketManager.socket.receive('disconnect');
        expect(pullRequestRepository.setPullRequests).toHaveBeenCalledWith([]);
    });

    it('should emit client:remind on chrome event', () => {
        const pullRequest = new PullRequest();
        const chromeEvent = new ChromeExtensionEvent(
            ChromeExtensionEvent.REMIND,
            pullRequest
        );

        extensionListener(chromeEvent);
        expect(socketManager.socket.emits).toEqual({'client:remind': [[pullRequest]]});
    });

    describe('chrome notifications', () => {
        let pullRequestEvent: PullRequestEvent;
        let pullRequest: PullRequest;
        let pullRequestsList;
        let johnSmith: User;
        let annaKowalsky: User;

        beforeEach(() => {
            pullRequest = new PullRequest();
            pullRequest.id = 1;
            pullRequest.targetRepository.fullName = 'team_name/repo_name';

            pullRequestsList = [pullRequest];

            pullRequestEvent = new PullRequestEvent();
            pullRequestEvent.pullRequests = pullRequestsList;
            pullRequestEvent.context = pullRequest;

            johnSmith = new User();
            johnSmith.username = 'john.smith';
            johnSmith.displayName = 'John Smith';

            annaKowalsky = new User();
            annaKowalsky.displayName = 'Anna Kowalsky';
            annaKowalsky.username = 'anna.kowalsky';
        });

        describe('on introduce', () => {
            it('should notify about author\'s pull requests', () => {
                const loggedInReviewer = new Reviewer();
                loggedInReviewer.user = johnSmith;
                loggedInReviewer.approved = false;

                pullRequest.reviewers.push(loggedInReviewer);

                socketManager.socket.receive(SocketServerEvent.INTRODUCED, pullRequestEvent);
                const stub: jasmine.Spy = notifier.notifyNewPullRequestAssigned as jasmine.Spy;
                expect(stub.calls.count()).toEqual(1);
            });

            it('should not notify about assigned pull requests when author already approved a PullRequest', () => {
                const unapprovedReviewer = new Reviewer();
                unapprovedReviewer.user = johnSmith;
                unapprovedReviewer.approved = false;

                const approvedReviewer = new Reviewer();
                approvedReviewer.user = johnSmith;
                approvedReviewer.approved = true;

                pullRequest.reviewers.push(unapprovedReviewer);

                const approvedPullRequest = new PullRequest();
                approvedPullRequest.id = 2;
                approvedPullRequest.targetRepository.fullName = 'team_name/repo_name';
                approvedPullRequest.reviewers.push(approvedReviewer);

                pullRequestsList.push(approvedPullRequest);

                socketManager.socket.receive(SocketServerEvent.INTRODUCED, pullRequestEvent);

                expect(notifier.notifyNewPullRequestAssigned).toHaveBeenCalledWith(pullRequest);
                expect(notifier.notifyNewPullRequestAssigned).not.toHaveBeenCalledWith(approvedPullRequest);
            });
        });

        describe('on updated pull request', () => {
            it('should notify about new assignment when assignment has changed' +
                ' and pull request has not been already indexed',
                () => {
                pullRequestEvent.sourceEvent = WebhookEvent.PULLREQUEST_UPDATED;
                hasAssignmentChanged = true;
                exists = false;

                const loggedInReviewer = new Reviewer();
                loggedInReviewer.user = johnSmith;
                loggedInReviewer.approved = false;

                pullRequest.reviewers.push(loggedInReviewer);

                socketManager.socket.receive(SocketServerEvent.PULLREQUESTS_UPDATED, pullRequestEvent);
                expect(notifier.notifyNewPullRequestAssigned).toHaveBeenCalledWith(pullRequest);
            });

            it('should notify about pull request update when pull request has been updated', () => {
                socketManager.socket.receive(SocketServerEvent.PULLREQUEST_UPDATED, pullRequest);
                expect(notifier.notifyPullRequestUpdated).toHaveBeenCalledWith(pullRequest);
            });
        });

        describe('on new pull request', () => {
            it('should notify about new pull request assignment on webhook:pullrequest:created', () => {
                pullRequestEvent.sourceEvent = WebhookEvent.PULLREQUEST_CREATED;

                const loggedInReviewer = new Reviewer();
                loggedInReviewer.user = johnSmith;
                loggedInReviewer.approved = false;

                pullRequest.author = annaKowalsky;
                pullRequest.reviewers.push(loggedInReviewer);

                socketManager.socket.receive(SocketServerEvent.PULLREQUESTS_UPDATED, pullRequestEvent);
                expect(notifier.notifyNewPullRequestAssigned).toHaveBeenCalledWith(pullRequest);
            });

            it('should not notify about new pull request on webhook:pullrequest:created, ' +
                'if author is assigned user',
                () => {
                pullRequestEvent.sourceEvent = WebhookEvent.PULLREQUEST_CREATED;
                pullRequest.author = johnSmith;

                socketManager.socket.receive(SocketServerEvent.PULLREQUESTS_UPDATED, pullRequestEvent);
                expect(notifier.notifyNewPullRequestAssigned).not.toHaveBeenCalled();
            });

            it('should not notify about new pull request on other event than pull:request:created', () => {
                pullRequestEvent.sourceEvent = 'webhook:pullrequest:fulfilled';

                const loggedInReviewer = new Reviewer();
                loggedInReviewer.user = johnSmith;
                loggedInReviewer.approved = false;

                pullRequest.author = annaKowalsky;
                pullRequest.reviewers.push(loggedInReviewer);

                socketManager.socket.receive(SocketServerEvent.PULLREQUESTS_UPDATED, pullRequestEvent);
                expect(notifier.notifyNewPullRequestAssigned).not.toHaveBeenCalled();
            });
        });

        describe('on merged pull request', () => {
            it('should notify author about merged pull request on webhook:pullrequest:fulfilled event',
                () => {
                pullRequestEvent.sourceEvent = WebhookEvent.PULLREQUEST_FULFILLED;
                pullRequest.author = johnSmith;

                socketManager.socket.receive(SocketServerEvent.PULLREQUESTS_UPDATED, pullRequestEvent);
                expect(notifier.notifyPullRequestMerged).toHaveBeenCalledWith(pullRequest);
            });

            it('should not notify about merged pull request on webhook:pullrequest:fulfilled event, ' +
                'if user is a reviewer',
                () => {
                pullRequestEvent.sourceEvent = WebhookEvent.PULLREQUEST_FULFILLED;
                pullRequest.author = annaKowalsky;

                const loggedInReviewer = new Reviewer();
                loggedInReviewer.user = johnSmith;
                loggedInReviewer.approved = false;
                pullRequest.reviewers.push(loggedInReviewer);

                socketManager.socket.receive(SocketServerEvent.PULLREQUESTS_UPDATED, pullRequestEvent);
                expect(notifier.notifyPullRequestMerged).not.toHaveBeenCalled();
            });
        });

        describe('on approval', () => {
            it('should notify author of pull request about approval', () => {
                pullRequestEvent.sourceEvent = WebhookEvent.PULLREQUEST_APPROVED;
                pullRequest.author = johnSmith;
                pullRequestEvent.actor = annaKowalsky;

                socketManager.socket.receive(SocketServerEvent.PULLREQUESTS_UPDATED, pullRequestEvent);
                expect(notifier.notifyPullRequestApproved).toHaveBeenCalledWith(pullRequest, annaKowalsky);
            });

            it('should not notify logged in user about approval, if he is not the author of this PR', () => {
                pullRequestEvent.sourceEvent = WebhookEvent.PULLREQUEST_APPROVED;
                pullRequest.author = annaKowalsky;
                pullRequestEvent.actor = johnSmith;

                socketManager.socket.receive(SocketServerEvent.PULLREQUESTS_UPDATED, pullRequestEvent);
                expect(notifier.notifyPullRequestApproved).not.toHaveBeenCalled();
            });
        });

        describe('on reminder', () => {
            it('should notify assignee with reminder about pull request', () => {
                socketManager.socket.receive(SocketServerEvent.REMIND, pullRequest);
                expect(notifier.notifyReminder).toHaveBeenCalledWith(pullRequest);
            });
        });

        describe('on comments', () => {
            it('should notify author about new comment under his pull request', () => {
                const commentLink = 'http://example.com';
                const pullRequestWithComment = new PullRequestCommentEvent();
                pullRequestWithComment.actor = johnSmith;
                pullRequestWithComment.pullRequest = pullRequest;
                pullRequestWithComment.comment.links = {
                    html: {
                        href: commentLink
                    }
                };

                socketManager.socket.receive(SocketServerEvent.NEW_COMMENT, pullRequestWithComment);

                expect(notifier.notifyNewCommentAdded).toHaveBeenCalledWith(pullRequest, johnSmith, commentLink);
            });

            it('should not notify author about new comment if he is an actor', () => {
                pullRequest.author = johnSmith;

                const pullRequestWithComment = new PullRequestCommentEvent();
                pullRequestWithComment.actor = johnSmith;
                pullRequestWithComment.pullRequest = pullRequest;

                socketManager.socket.receive(SocketServerEvent.NEW_COMMENT, pullRequestWithComment);

                expect(notifier.notifyNewCommentAdded).not.toHaveBeenCalled();
            });

            it('should notify user about new comment reply', () => {
                const commentLink = 'http://example.com';

                const pullRequestWithComment = new PullRequestCommentEvent();
                pullRequestWithComment.actor = johnSmith;
                pullRequestWithComment.pullRequest = pullRequest;
                pullRequestWithComment.comment.links = {
                    html: {
                        href: commentLink
                    }
                };

                socketManager.socket.receive(SocketServerEvent.NEW_REPLY_FOR_COMMENT, pullRequestWithComment);

                expect(notifier.notifyNewReplyOnComment).toHaveBeenCalledWith(pullRequest, johnSmith, commentLink);
            });
        });
    });

    describe('indicator state', () => {
        it('should show number of pull requests on introduced event', () => {
            const pullRequest: PullRequest = new PullRequest();
            const pullRequestEvent: PullRequestEvent = new PullRequestEvent();
            pullRequestRepository.pullRequests = [pullRequest];

            socketManager.socket.receive(SocketServerEvent.INTRODUCED, pullRequestEvent);
            expect(indicator.setText).toHaveBeenCalledWith('1');
        });

        it('should show number of pull requests on pullrequest updated event', () => {
            const pullRequest: PullRequest = new PullRequest();
            const pullRequestEvent: PullRequestEvent = new PullRequestEvent();
            pullRequestRepository.pullRequests = [pullRequest];

            socketManager.socket.receive(SocketServerEvent.PULLREQUESTS_UPDATED, pullRequestEvent);
            expect(indicator.setText).toHaveBeenCalledWith('1');
        });

        it('should bring back default badge text on disconnection', () => {
            const pullRequest: PullRequest = new PullRequest();
            const pullRequestEvent: PullRequestEvent = new PullRequestEvent();
            pullRequestRepository.pullRequests = [pullRequest];

            socketManager.socket.receive(SocketServerEvent.PULLREQUESTS_UPDATED, pullRequestEvent);
            expect(indicator.setText).toHaveBeenCalledWith('1');

            socketManager.socket.receive('disconnect');
            expect(indicator.reset).toHaveBeenCalled();
        });
    });
});
