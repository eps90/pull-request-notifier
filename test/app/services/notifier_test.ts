///<reference path="../../../app/_typings.ts"/>

fdescribe('Notifier', () => {
    var notifier: BitbucketNotifier.Notifier,
        expectedOptions = {
            type: 'basic',
            iconUrl: '../assets/img/bitbucket_logo_raster.jpg',
            title: '',
            message: '',
            priority: 2
        };

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

        expectedOptions.title = 'Test title';
        notifier.notify(expectedOptions);
        expect(window['chrome'].notifications.create).toHaveBeenCalledWith(expectedOptions);
    });

    it('should notify about new pull request', () => {
        spyOn(window['chrome'].notifications, 'create');

        var pullRequest = new BitbucketNotifier.PullRequest();
        pullRequest.title = 'This is some title';

        expectedOptions.title = 'New pull request assigned to you!';
        expectedOptions.message = pullRequest.title;

        notifier.notifyNewPullRequestAssigned(pullRequest);
        expect(window['chrome'].notifications.create).toHaveBeenCalledWith(expectedOptions);
    });

    it('should notify about merged pull request', () => {
        spyOn(window['chrome'].notifications, 'create');

        var pullRequest = new BitbucketNotifier.PullRequest();
        pullRequest.title = 'This is some title';
        expectedOptions.title = 'Your pull request has been merged';
        expectedOptions.message = pullRequest.title;

        notifier.notifyPullRequestMerged(pullRequest);
        expect(window['chrome'].notifications.create).toHaveBeenCalledWith(expectedOptions);
    });
});
