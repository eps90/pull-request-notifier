import {NotificationRepository} from "../../../app/services/notification_repository";
import {PullRequestNotification} from "../../../app/services/models";
import * as angular from 'angular';

describe('NotificationRepository', () => {
    var notificationRepository: NotificationRepository;

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
        var actualNotification = <PullRequestNotification> notificationRepository.find(notificationId);

        expect(actualNotification.pullRequestHtmlLink).toEqual('http://example.com');
    });
});
