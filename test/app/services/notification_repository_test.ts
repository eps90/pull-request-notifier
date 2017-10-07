import {NotificationRepository} from '../../../app/services/notification_repository';
import * as angular from 'angular';
import {PullRequestNotification} from '../../../app/models/pull_request_notification';

describe('NotificationRepository', () => {
    let notificationRepository: NotificationRepository;

    beforeEach(angular.mock.module('bitbucketNotifier.background'));
    beforeEach(inject([
        'NotificationRepository',
        (n) => {
            notificationRepository = n;
        }
    ]));

    it('should add notification to repository', () => {
        const notificationId = 'aaaa';
        const prLink = 'http://example.com';

        notificationRepository.add(notificationId, prLink);
        expect(notificationRepository.getAll().length).toEqual(1);
    });

    it('should find single notification', () => {
        const notificationId = 'abcd';
        const prLink = 'http://example.com';

        notificationRepository.add(notificationId, prLink);
        const actualNotification = notificationRepository.find(notificationId) as PullRequestNotification;

        expect(actualNotification.pullRequestHtmlLink).toEqual('http://example.com');
    });
});
