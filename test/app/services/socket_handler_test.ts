///<reference path="../../../app/_typings.ts"/>

describe('SocketHandler', () => {
    var socketHandler,
        socket,
        localStorageService: angular.local.storage.ILocalStorageService,
        pullRequestRepository: BitbucketNotifier.PullRequestRepository,
        notifier: BitbucketNotifier.Notifier;

    beforeEach(module('bitbucketNotifier'));
    beforeEach(module(['$provide', ($p: ng.auto.IProvideService) => {
        $p.value('Notifier', {
            notifyNewPullRequestAssigned: jasmine.createSpy('notifyNewPullRequestAssigned'),
            notifyPullRequestMerged: jasmine.createSpy('notifyPullRequestMerged'),
            notifyPullRequestApproved: jasmine.createSpy('notifyPullRequestApproved')
        });
    }]));
    beforeEach(inject([
        'SocketHandler',
        'Socket',
        'localStorageService',
        'PullRequestRepository',
        'Notifier',
        (sh, s, l, prr, n) => {
            socketHandler = sh;
            socket = s;
            localStorageService = l;
            pullRequestRepository = prr;
            notifier = n;
        }
    ]));
    beforeEach(() => {
        localStorageService.set('app:user', 'john.smith');
    });

    it('should emit client:introduce event with logged in user, on connection', () => {
        socket.receive('connect');
        expect(socket.emits).toEqual(jasmine.objectContaining({'client:introduce': jasmine.anything()}));
        expect(socket.emits[BitbucketNotifier.SocketClientEvent.INTRODUCE][0]).toEqual(['john.smith']);
    });

    it('should update pull request repository on server:pullrequests:updated', () => {
        var pullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
        var userPullRequest: BitbucketNotifier.PullRequestEvent = new BitbucketNotifier.PullRequestEvent();
        userPullRequest.sourceEvent = 'pullrequest:created';
        userPullRequest.pullRequests = [pullRequest];
        userPullRequest.context = pullRequest;

        socket.receive(BitbucketNotifier.SocketServerEvent.PULLREQUESTS_UPDATED, userPullRequest);

        expect(pullRequestRepository.pullRequests.length).toBe(1);
        expect(pullRequestRepository.pullRequests[0]).toEqual(pullRequest);
    });

    describe('chrome notifications', () => {
        var pullRequestEvent: BitbucketNotifier.PullRequestEvent;
        var pullRequest: BitbucketNotifier.PullRequest;
        var johnSmith: BitbucketNotifier.User;
        var annaKowalsky: BitbucketNotifier.User;

        beforeEach(() => {
            pullRequest = new BitbucketNotifier.PullRequest();
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

        describe('on new pull request', () => {
            it('should notify about new pull request assignment on webhook:pullrequest:created', () => {
                pullRequestEvent.sourceEvent = BitbucketNotifier.WebhookEvent.PULLREQUEST_CREATED;

                var loggedInReviewer = new BitbucketNotifier.Reviewer();
                loggedInReviewer.user = johnSmith;
                loggedInReviewer.approved = false;

                pullRequest.author = annaKowalsky;
                pullRequest.reviewers.push(loggedInReviewer);

                socket.receive(BitbucketNotifier.SocketServerEvent.PULLREQUESTS_UPDATED, pullRequestEvent);
                expect(notifier.notifyNewPullRequestAssigned).toHaveBeenCalledWith(pullRequest)
            });

            it('should not notify about new pull request on webhook:pullrequest:created, if author is assigned user', () => {
                pullRequestEvent.sourceEvent = BitbucketNotifier.WebhookEvent.PULLREQUEST_CREATED;
                pullRequest.author = johnSmith;

                socket.receive(BitbucketNotifier.SocketServerEvent.PULLREQUESTS_UPDATED, pullRequestEvent);
                expect(notifier.notifyNewPullRequestAssigned).not.toHaveBeenCalled();
            });

            it('should not notify about new pull request on other event than pull:request:created', () => {
                pullRequestEvent.sourceEvent = 'webhook:pullrequest:updated';

                var loggedInReviewer = new BitbucketNotifier.Reviewer();
                loggedInReviewer.user = johnSmith;
                loggedInReviewer.approved = false;

                pullRequest.author = annaKowalsky;
                pullRequest.reviewers.push(loggedInReviewer);

                socket.receive(BitbucketNotifier.SocketServerEvent.PULLREQUESTS_UPDATED, pullRequestEvent);
                expect(notifier.notifyNewPullRequestAssigned).not.toHaveBeenCalled();
            });
        });

        describe('on merged pull request', () => {
            it('should notify author about merged pull request on webhook:pullrequest:fulfilled event', () => {
                pullRequestEvent.sourceEvent = BitbucketNotifier.WebhookEvent.PULLREQUEST_FULFILLED;
                pullRequest.author = johnSmith;

                socket.receive(BitbucketNotifier.SocketServerEvent.PULLREQUESTS_UPDATED, pullRequestEvent);
                expect(notifier.notifyPullRequestMerged).toHaveBeenCalledWith(pullRequest);
            });

            it('should not notify about merged pull request on webhook:pullrequest:fulfilled event, if user is a reviewer', () => {
                pullRequestEvent.sourceEvent = BitbucketNotifier.WebhookEvent.PULLREQUEST_FULFILLED;
                pullRequest.author = annaKowalsky;

                var loggedInReviewer = new BitbucketNotifier.Reviewer();
                loggedInReviewer.user = johnSmith;
                loggedInReviewer.approved = false;
                pullRequest.reviewers.push(loggedInReviewer);

                socket.receive(BitbucketNotifier.SocketServerEvent.PULLREQUESTS_UPDATED, pullRequestEvent);
                expect(notifier.notifyPullRequestMerged).not.toHaveBeenCalled();
            });
        });

        describe('on approval',() => {
            it('should notify author of pull request about approval', () => {
                pullRequestEvent.sourceEvent = BitbucketNotifier.WebhookEvent.PULLREQUEST_APPROVED;
                pullRequest.author = johnSmith;
                pullRequestEvent.actor = annaKowalsky;

                socket.receive(BitbucketNotifier.SocketServerEvent.PULLREQUESTS_UPDATED, pullRequestEvent);
                expect(notifier.notifyPullRequestApproved).toHaveBeenCalledWith(pullRequest, annaKowalsky);
            });

            it('should not notify logged in user about approval, if he is not the author of this PR', () => {
                pullRequestEvent.sourceEvent = BitbucketNotifier.WebhookEvent.PULLREQUEST_APPROVED;
                pullRequest.author = annaKowalsky;
                pullRequestEvent.actor = johnSmith;

                socket.receive(BitbucketNotifier.SocketServerEvent.PULLREQUESTS_UPDATED, pullRequestEvent);
                expect(notifier.notifyPullRequestApproved).not.toHaveBeenCalled();
            });
        });
    });
});
