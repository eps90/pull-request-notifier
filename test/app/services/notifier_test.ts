///<reference path="../../../app/_typings.ts"/>

fdescribe('Notifier', () => {
    var notifier: BitbucketNotifier.Notifier;

    beforeEach(module('bitbucketNotifier'));
    beforeEach(() => {
        window['chrome'] = {notifications: {create: () => {}}};
    });
    beforeEach(inject([
        'Notifier',
        (n) => {
            notifier = n;
        }
    ]));

    it('should create notificaion via Chrome API', () => {
        spyOn(window['chrome'].notifications, 'create');
        var notificationOptions = {
            title: 'Test title'
        };
        notifier.notify(notificationOptions);
        expect(window['chrome'].notifications.create).toHaveBeenCalledWith(notificationOptions);
    });

    it('should notify about new pull request', () => {
        spyOn(window['chrome'].notifications, 'create');

        var pullRequest = new BitbucketNotifier.PullRequest();
        pullRequest.title = 'This is some title';

        var expectedNotificationOpts = {
            title: 'New pull request assigned to you!',
            message: pullRequest.title
        };

        notifier.notifyNewPullRequestAssigned(pullRequest);
        expect(window['chrome'].notifications.create).toHaveBeenCalledWith(expectedNotificationOpts);
    });

    it('should notify about merged pull request', () => {
        spyOn(window['chrome'].notifications, 'create');

        var pullRequest = new BitbucketNotifier.PullRequest();
        pullRequest.title = 'This is some title';

        var expectedNotificationOpts = {
            title: 'Your pull request has been merged',
            message: pullRequest.title
        };

        notifier.notifyPullRequestMerged(pullRequest);
        expect(window['chrome'].notifications.create).toHaveBeenCalledWith(expectedNotificationOpts);
    });
});
