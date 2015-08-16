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
            notifyNewPullRequestAssigned: jasmine.createSpy('notifyNewPullRequestAssigned')
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
        expect(socket.emits['client:introduce'][0]).toEqual(['john.smith']);
    });

    it('should update pull request repository on server:pullrequests:updated', () => {
        var pullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
        var userPullRequest: BitbucketNotifier.PullRequestEvent = new BitbucketNotifier.PullRequestEvent();
        userPullRequest.triggeredEvent = 'pullrequest:created';
        userPullRequest.pullRequests = [pullRequest];
        userPullRequest.context = pullRequest;

        socket.receive('server:pullrequests:updated', userPullRequest);

        expect(pullRequestRepository.pullRequests.length).toBe(1);
        expect(pullRequestRepository.pullRequests[0]).toEqual(pullRequest);
    });

    fdescribe('chrome notifications', () => {
        var pullRequestEvent: BitbucketNotifier.PullRequestEvent;
        var pullRequest: BitbucketNotifier.PullRequest;
        beforeEach(() => {
            pullRequest = new BitbucketNotifier.PullRequest();
            pullRequestEvent = new BitbucketNotifier.PullRequestEvent();
            pullRequestEvent.pullRequests = [pullRequest];
            pullRequestEvent.context = pullRequest;

            var loggedInUser = new BitbucketNotifier.User();
            loggedInUser.username = 'john.smith';
            loggedInUser.displayName = 'John Smith';

            var prAuthor = new BitbucketNotifier.User();
            prAuthor.displayName = 'Anna Kowalsky';
            prAuthor.username = 'anna.kowalsky';

            var loggedInReviewer = new BitbucketNotifier.Reviewer();
            loggedInReviewer.user = loggedInUser;
            loggedInReviewer.approved = false;

            pullRequest.author = prAuthor;
            pullRequest.reviewers.push(loggedInReviewer);
        });

        it('should notify about new merge request assignment', () => {
            pullRequestEvent.triggeredEvent = 'pullrequest:created';

            socket.receive('server:pullrequests:updated', pullRequestEvent);
            expect(notifier.notifyNewPullRequestAssigned).toHaveBeenCalledWith(pullRequest)
        });
    });
});
