///<reference path="../../../app/_typings.ts"/>

describe('SocketHandler', () => {
    var socketHandler,
        socket,
        localStorageService: angular.local.storage.ILocalStorageService,
        pullRequestRepository: BitbucketNotifier.PullRequestRepository;

    beforeEach(module('bitbucketNotifier'));
    beforeEach(inject([
        'SocketHandler',
        'Socket',
        'localStorageService',
        'PullRequestRepository',
        (sh, s, l, prr) => {
            socketHandler = sh;
            socket = s;
            localStorageService = l;
            pullRequestRepository = prr;
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
});
