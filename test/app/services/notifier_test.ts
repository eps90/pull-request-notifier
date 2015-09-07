///<reference path="../../../app/_typings.ts"/>

describe('Notifier', () => {
    var notifier: BitbucketNotifier.Notifier,
        expectedOptions,
        notificationRepostory: BitbucketNotifier.NotificationRepository,
        notificationStub: BitbucketNotifier.PullRequestNotification,
        onClickedStub;

    beforeEach(() => {
        expectedOptions = {
            type: 'basic',
            iconUrl: '../../assets/img/bitbucket_logo_raw.png',
            title: '',
            message: '',
            contextMessage: '',
            priority: 2
        };
    });
    beforeEach(module('bitbucketNotifier.background'));
    beforeEach(() => {
        window['chrome'] = {
            notifications: {
                create: jasmine.createSpy('chrome.notifications.create'),
                onClicked: {
                    addListener: jasmine.createSpy('chrome.notifications.onClicked.addListener').and.callFake((fn) => {
                        onClickedStub = fn;
                    })
                }
            },
            tabs: {
                create: jasmine.createSpy('chrome.tabs.create')
            }
        };
    });
    beforeEach(module([
        '$provide',
        ($provide: ng.auto.IProvideService) => {
            $provide.value('NotificationRepository', {
                add: jasmine.createSpy('NotificationRepository.add'),
                find: jasmine.createSpy('NotificationRepository.find').and.callFake(() => {
                    return notificationStub;
                })
            });
        }
    ]));
    beforeEach(inject([
        'Notifier',
        'NotificationRepository',
        (n, nr) => {
            notifier = n;
            notificationRepostory = nr;
        }
    ]));

    it('should create notificaion via Chrome API', () => {
        expectedOptions.title = 'Test title';
        var notificationId = 'aaabbbb';
        var notificationLink = 'http://example.com';
        notifier.notify(expectedOptions, notificationId, notificationLink);
        expect(window['chrome'].notifications.create).toHaveBeenCalledWith(notificationId, expectedOptions);
        expect(notificationRepostory.add).toHaveBeenCalledWith(notificationId, notificationLink);
    });

    it('should open new tab with pull request on click', () => {
        var notification = new BitbucketNotifier.PullRequestNotification();
        var notificationId = 'abcd123';
        var pullRequestHtmlLink = 'http://example.com';
        notification.notificationId = notificationId;
        notification.pullRequestHtmlLink = pullRequestHtmlLink;

        notificationStub = notification;
        onClickedStub();
        expect(window['chrome'].tabs.create).toHaveBeenCalledWith({url: pullRequestHtmlLink});
    });

    it('should notify about new pull request', () => {
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
        var mergingUser = new BitbucketNotifier.User();
        mergingUser.displayName = 'John Smith';

        var pullRequest = new BitbucketNotifier.PullRequest();
        pullRequest.title = 'This is some title';

        expectedOptions.title = 'Your pull request has been approved';
        expectedOptions.message = pullRequest.title;
        expectedOptions.contextMessage = 'by John Smith';
        expectedOptions.iconUrl = '../../assets/img/bitbucket_approved.png';

        notifier.notifyPullRequestApproved(pullRequest, mergingUser);
        expect(window['chrome'].notifications.create).toHaveBeenCalledWith(jasmine.anything(), expectedOptions);
    });

    it('should notify on reminders', () => {
        var pullRequest = new BitbucketNotifier.PullRequest();
        pullRequest.title = 'This is some title';

        expectedOptions.title = 'Someone reminds you to review a pull request';
        expectedOptions.message = pullRequest.title;

        notifier.notifyReminder(pullRequest);
        expect(window['chrome'].notifications.create).toHaveBeenCalledWith(jasmine.anything(), expectedOptions);
    });
});
