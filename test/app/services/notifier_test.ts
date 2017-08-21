import {Notifier} from '../../../app/services/notifier';
import {SoundManager} from '../../../app/services/sound_manager';
import {NotificationRepository} from '../../../app/services/notification_repository';
import * as angular from 'angular';
import {NotificationIcon} from '../../../app/models/notification_icon';
import {PullRequestNotification} from '../../../app/models/pull_request_notification';
import {User} from '../../../app/models/user';
import {PullRequest} from '../../../app/models/pull_request';

describe('Notifier', () => {
    let notifier: Notifier;
    let expectedOptions;
    let soundManager: SoundManager;
    let notificationRepostory: NotificationRepository;
    let notificationStub: PullRequestNotification;
    let onClickedStub;

    beforeEach(() => {
        expectedOptions = {
            type: 'basic',
            iconUrl: NotificationIcon.DEFAULT,
            title: '',
            message: '',
            contextMessage: '',
            priority: 2,
            requireInteraction: true
        };
    });
    beforeEach(angular.mock.module('bitbucketNotifier.background'));
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
    beforeEach(angular.mock.module([
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
        const notificationId = 'aaabbbb';
        const notificationLink = 'http://example.com';
        notifier.notify(expectedOptions, notificationId, notificationLink);
        expect(window['chrome'].notifications.create).toHaveBeenCalledWith(notificationId, expectedOptions);
        expect(notificationRepostory.add).toHaveBeenCalledWith(notificationId, notificationLink);
    });

    it('should open new tab with pull request on click and close the notification', () => {
        const notification = new PullRequestNotification();
        const notificationId = 'abcd123';
        const pullRequestHtmlLink = 'http://example.com';
        notification.notificationId = notificationId;
        notification.pullRequestHtmlLink = pullRequestHtmlLink;

        notificationStub = notification;
        onClickedStub(notificationId);

        expect(window['chrome'].tabs.create).toHaveBeenCalledWith({url: pullRequestHtmlLink});
        expect(window['chrome'].notifications.clear).toHaveBeenCalledWith(notificationId);
    });

    it('should notify about new pull request', () => {
        const author = new User();
        author.displayName = 'John Smith';

        const pullRequest = new PullRequest();
        pullRequest.title = 'This is some title';
        pullRequest.author = author;

        expectedOptions.title = 'New pull request assigned to you!';
        expectedOptions.message = pullRequest.title;
        expectedOptions.contextMessage = 'by John Smith';
        expectedOptions.iconUrl = NotificationIcon.NEW_PULL_REQUEST;

        notifier.notifyNewPullRequestAssigned(pullRequest);
        expect(window['chrome'].notifications.create).toHaveBeenCalledWith(jasmine.anything(), expectedOptions);
    });

    it('should notify about merged pull request', () => {
        const author = new User();
        author.displayName = 'John Smith';

        const pullRequest = new PullRequest();
        pullRequest.title = 'This is some title';
        pullRequest.author = author;

        expectedOptions.title = 'Your pull request has been merged';
        expectedOptions.message = pullRequest.title;
        expectedOptions.iconUrl = NotificationIcon.MERGED_PULL_REQUEST;

        notifier.notifyPullRequestMerged(pullRequest);
        expect(window['chrome'].notifications.create).toHaveBeenCalledWith(jasmine.anything(), expectedOptions);
    });

    it('should notify about approvals', () => {
        const mergingUser = new User();
        mergingUser.displayName = 'John Smith';

        const pullRequest = new PullRequest();
        pullRequest.title = 'This is some title';

        expectedOptions.title = 'Your pull request has been approved';
        expectedOptions.message = pullRequest.title;
        expectedOptions.contextMessage = 'by John Smith';
        expectedOptions.iconUrl = NotificationIcon.APPROVED_PULL_REQUEST;

        notifier.notifyPullRequestApproved(pullRequest, mergingUser);
        expect(window['chrome'].notifications.create).toHaveBeenCalledWith(jasmine.anything(), expectedOptions);
    });

    it('should notify on reminders', () => {
        const pullRequest = new PullRequest();
        pullRequest.title = 'This is some title';

        expectedOptions.title = 'Someone reminds you to review a pull request';
        expectedOptions.message = pullRequest.title;
        expectedOptions.iconUrl = NotificationIcon.PULL_REQUEST_REMINDER;

        notifier.notifyReminder(pullRequest);
        expect(window['chrome'].notifications.create).toHaveBeenCalledWith(jasmine.anything(), expectedOptions);
    });

    it('should filter out emojis from title', () => {
        const pullRequest = new PullRequest();
        pullRequest.title = ':name_badge: This is some title';
        pullRequest.author.displayName = 'John Smith';

        expectedOptions.title = 'New pull request assigned to you!';
        expectedOptions.message = 'This is some title';
        expectedOptions.contextMessage = 'by John Smith';
        expectedOptions.iconUrl = NotificationIcon.NEW_PULL_REQUEST;

        notifier.notifyNewPullRequestAssigned(pullRequest);
        expect(window['chrome'].notifications.create).toHaveBeenCalledWith(jasmine.anything(), expectedOptions);
    });

    it('should notify about pull request update', () => {
        const pullRequest = new PullRequest();
        pullRequest.title = 'This is some title';
        pullRequest.author.displayName = 'John Kowalsky';

        expectedOptions.title = 'Pull request has been updated';
        expectedOptions.message = 'This is some title';
        expectedOptions.contextMessage = 'by John Kowalsky';
        expectedOptions.iconUrl = NotificationIcon.UPDATED_PULL_REQUEST;

        notifier.notifyPullRequestUpdated(pullRequest);
        expect(window['chrome'].notifications.create).toHaveBeenCalledWith(jasmine.anything(), expectedOptions);
    });

    it('should notify about new comment', () => {
        const pullRequest = new PullRequest();
        pullRequest.title = 'This is some title';

        const commentingUser = new User();
        commentingUser.displayName = 'John Smith';

        const commentLink = 'http://example.com';

        expectedOptions.title = 'New comment on your pull request!';
        expectedOptions.message = 'This is some title';
        expectedOptions.contextMessage = 'by John Smith';
        expectedOptions.iconUrl = NotificationIcon.NEW_COMMENT_ON_PULL_REQUEST;

        notifier.notifyNewCommentAdded(pullRequest, commentingUser, commentLink);
        expect(window['chrome'].notifications.create).toHaveBeenCalledWith(jasmine.anything(), expectedOptions);
    });

    it('should notify about new reply for a comment', () => {
        const pullRequest = new PullRequest();
        pullRequest.title = 'This is some title';

        const replyingUser = new User();
        replyingUser.displayName = 'John Smith';

        const commentLink = 'http://example.com';

        expectedOptions.title = 'New reply for your comment';
        expectedOptions.message = 'This is some title';
        expectedOptions.contextMessage = 'by John Smith';
        expectedOptions.iconUrl = NotificationIcon.NEW_REPLY_ON_PULL_REQUEST;

        notifier.notifyNewReplyOnComment(pullRequest, replyingUser, commentLink);
        expect(window['chrome'].notifications.create).toHaveBeenCalledWith(jasmine.anything(), expectedOptions);
    });

    describe('with sounds', () => {
        it('should play a notification sound for new pull request notification', () => {
            const pullRequest = new PullRequest();
            notifier.notifyNewPullRequestAssigned(pullRequest);
            expect(soundManager.playNewPullRequestSound).toHaveBeenCalled();
        });

        it('should play a notification sound for approved pull request notification', () => {
            const pullRequest = new PullRequest();
            notifier.notifyPullRequestApproved(pullRequest, new User());
            expect(soundManager.playApprovedPullRequestSound).toHaveBeenCalled();
        });

        it('should play a notification sound for merged pull request notification', () => {
            const pullRequest = new PullRequest();
            notifier.notifyPullRequestMerged(pullRequest);
            expect(soundManager.playMergedPullRequestSound).toHaveBeenCalled();
        });

        it('should play a notification sound for reminder notification', () => {
            const pullRequest = new PullRequest();
            notifier.notifyReminder(pullRequest);
            expect(soundManager.playReminderSound).toHaveBeenCalled();
        });
    });
});
