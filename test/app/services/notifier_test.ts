///<reference path="../../../app/_typings.ts"/>

describe('Notifier', () => {
    var notifier: BitbucketNotifier.Notifier,
        expectedOptions,
        soundManager: BitbucketNotifier.SoundManager,
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
            priority: 2,
            requireInteraction: true
        };
    });
    beforeEach(module('bitbucketNotifier.background'));
    beforeEach(() => {
        window['chrome'] = {
            notifications: {
                create: jasmine.createSpy('chrome.notifications.create'),
                clear: jasmine.createSpy('chrome.notifications.clear'),
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

            $provide.value('SoundManager', {
                playNewPullRequestSound: jasmine.createSpy('SoundManager.playNewPullRequestSound'),
                playApprovedPullRequestSound: jasmine.createSpy('SoundManager.playApprovedPullRequestSound'),
                playMergedPullRequestSound: jasmine.createSpy('SoundManager.playMergedPullRequestSound'),
                playReminderSound: jasmine.createSpy('SoundManager.playReminderSound')
            });
        }
    ]));
    beforeEach(inject([
        'Notifier',
        'NotificationRepository',
        'SoundManager',
        (n, nr, s) => {
            notifier = n;
            notificationRepostory = nr;
            soundManager = s;
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

    it('should open new tab with pull request on click and close the notification', () => {
        var notification = new BitbucketNotifier.PullRequestNotification();
        var notificationId = 'abcd123';
        var pullRequestHtmlLink = 'http://example.com';
        notification.notificationId = notificationId;
        notification.pullRequestHtmlLink = pullRequestHtmlLink;

        notificationStub = notification;
        onClickedStub(notificationId);

        expect(window['chrome'].tabs.create).toHaveBeenCalledWith({url: pullRequestHtmlLink});
        expect(window['chrome'].notifications.clear).toHaveBeenCalledWith(notificationId);
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
        expectedOptions.iconUrl = '../../assets/img/bitbucket_reminder.png';

        notifier.notifyReminder(pullRequest);
        expect(window['chrome'].notifications.create).toHaveBeenCalledWith(jasmine.anything(), expectedOptions);
    });

    it('should filter out emojis from title', () => {
        var pullRequest = new BitbucketNotifier.PullRequest();
        pullRequest.title = ':name_badge: This is some title';
        pullRequest.author.displayName = 'John Smith';

        expectedOptions.title = 'New pull request assigned to you!';
        expectedOptions.message = 'This is some title';
        expectedOptions.contextMessage = 'by John Smith';
        expectedOptions.iconUrl = '../../assets/img/bitbucket_new.png';

        notifier.notifyNewPullRequestAssigned(pullRequest);
        expect(window['chrome'].notifications.create).toHaveBeenCalledWith(jasmine.anything(), expectedOptions);
    });

    it('should notify about pull request update', () => {
        const pullRequest = new BitbucketNotifier.PullRequest();
        pullRequest.title = 'This is some title';
        pullRequest.author.displayName = 'John Kowalsky';

        expectedOptions.title = 'Pull request has been updated';
        expectedOptions.message = 'This is some title';
        expectedOptions.contextMessage = 'by John Kowalsky';
        expectedOptions.iconUrl = '../../assets/img/bitbucket_updated.png';

        notifier.notifyPullRequestUpdated(pullRequest);
        expect(window['chrome'].notifications.create).toHaveBeenCalledWith(jasmine.anything(), expectedOptions);
    });

    describe('with sounds', () => {
        it('should play a notification sound for new pull request notification', () => {
            var pullRequest = new BitbucketNotifier.PullRequest();
            notifier.notifyNewPullRequestAssigned(pullRequest);
            expect(soundManager.playNewPullRequestSound).toHaveBeenCalled();
        });

        it('should play a notification sound for approved pull request notification', () => {
            var pullRequest = new BitbucketNotifier.PullRequest();
            notifier.notifyPullRequestApproved(pullRequest, new BitbucketNotifier.User());
            expect(soundManager.playApprovedPullRequestSound).toHaveBeenCalled();
        });

        it('should play a notification sound for merged pull request notification', () => {
            var pullRequest = new BitbucketNotifier.PullRequest();
            notifier.notifyPullRequestMerged(pullRequest);
            expect(soundManager.playMergedPullRequestSound).toHaveBeenCalled();
        });

        it('should play a notification sound for reminder notification', () => {
            var pullRequest = new BitbucketNotifier.PullRequest();
            notifier.notifyReminder(pullRequest);
            expect(soundManager.playReminderSound).toHaveBeenCalled();
        });
    });
});
