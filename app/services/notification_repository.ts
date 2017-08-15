import {PullRequestNotification, Notification} from './models';

export class NotificationRepository {
    private notifications: Notification[] = [];

    public add(notificationId: string, pullRequestLink: string): void {
        const prNotification = new PullRequestNotification();
        prNotification.notificationId = notificationId;
        prNotification.pullRequestHtmlLink = pullRequestLink;

        this.notifications.push(prNotification);
    }

    public getAll(): Notification[] {
        return this.notifications;
    }

    public find(notificationId: string): Notification {
        for (const notification of this.notifications) {
            if (notification.notificationId === notificationId) {
                return notification;
            }
        }

        return new PullRequestNotification();
    }
}
