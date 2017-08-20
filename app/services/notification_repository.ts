import {PullRequestNotification} from '../models/pull_request_notification';
import {NotificationInterface} from '../models/notification_interface';

export class NotificationRepository {
    private notifications: NotificationInterface[] = [];

    public add(notificationId: string, pullRequestLink: string): void {
        const prNotification = new PullRequestNotification();
        prNotification.notificationId = notificationId;
        prNotification.pullRequestHtmlLink = pullRequestLink;

        this.notifications.push(prNotification);
    }

    public getAll(): NotificationInterface[] {
        return this.notifications;
    }

    public find(notificationId: string): NotificationInterface {
        for (const notification of this.notifications) {
            if (notification.notificationId === notificationId) {
                return notification;
            }
        }

        return new PullRequestNotification();
    }
}
