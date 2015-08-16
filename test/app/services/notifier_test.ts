///<reference path="../../../app/_typings.ts"/>

describe('Notifier', () => {
    var notifier: BitbucketNotifier.Notifier,
        expectedOptions;

    beforeEach(() => {
        expectedOptions = {
            type: 'basic',
            iconUrl: '../../assets/img/bitbucket_logo_raster.jpg',
            title: '',
            message: '',
            contextMessage: '',
            priority: 2
        };
    });
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
        expect(window['chrome'].notifications.create).toHaveBeenCalledWith(jasmine.anything(), expectedOptions);
    });

    it('should notify about new pull request', () => {
        spyOn(window['chrome'].notifications, 'create');

        var author = new BitbucketNotifier.User();
        author.displayName = 'John Smith';

        var pullRequest = new BitbucketNotifier.PullRequest();
        pullRequest.title = 'This is some title';
        pullRequest.author = author;

        expectedOptions.title = 'New pull request assigned to you!';
        expectedOptions.message = pullRequest.title;
        expectedOptions.contextMessage = 'by John Smith';
        expectedOptions.iconUrl = '../../assets/img/bitbucket_new.png';

        notifier.notifyNewPullRequestAssigned(pullRequest);
        expect(window['chrome'].notifications.create).toHaveBeenCalledWith(jasmine.anything(), expectedOptions);
    });

    it('should notify about merged pull request', () => {
        spyOn(window['chrome'].notifications, 'create');
        var author = new BitbucketNotifier.User();
        author.displayName = 'John Smith';

        var pullRequest = new BitbucketNotifier.PullRequest();
        pullRequest.title = 'This is some title';
        pullRequest.author = author;

        expectedOptions.title = 'Your pull request has been merged';
        expectedOptions.message = pullRequest.title;
        expectedOptions.iconUrl = '../../assets/img/bitbucket_merged.png';

        notifier.notifyPullRequestMerged(pullRequest);
        expect(window['chrome'].notifications.create).toHaveBeenCalledWith(jasmine.anything(), expectedOptions);
    });

    it('should notify about approvals', () => {
        spyOn(window['chrome'].notifications, 'create');
        var mergingUser = new BitbucketNotifier.User();
        mergingUser.displayName = 'John Smith';

        var pullRequest = new BitbucketNotifier.PullRequest();
        pullRequest.title = 'This is some title';

        expectedOptions.title = 'Your pull request has been approved';
        expectedOptions.message = pullRequest.title;
        expectedOptions.contextMessage = 'by John Smith';

        notifier.notifyPullRequestApproved(pullRequest, mergingUser);
        expect(window['chrome'].notifications.create).toHaveBeenCalledWith(jasmine.anything(), expectedOptions);
    });
});
