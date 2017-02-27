///<reference path="../../../app/_typings.ts"/>

describe('NotificationRepository', () => {
    var notificationRepository: BitbucketNotifier.NotificationRepository;

    beforeEach(angular.mock.module('bitbucketNotifier.background'));
    beforeEach(inject([
        'NotificationRepository',
        (n) => {
            notificationRepository = n;
        }
    ]));

    it('should add notification to repository', () => {
        var notificationId = 'aaaa';
        var prLink = 'http://example.com';

        notificationRepository.add(notificationId, prLink);
        expect(notificationRepository.getAll().length).toEqual(1);
    });

    it('should find single notification', () => {
        var notificationId = 'abcd';
        var prLink = 'http://example.com';

        notificationRepository.add(notificationId, prLink);
        var actualNotification = <BitbucketNotifier.PullRequestNotification> notificationRepository.find(notificationId);

        expect(actualNotification.pullRequestHtmlLink).toEqual('http://example.com');
    });
});
