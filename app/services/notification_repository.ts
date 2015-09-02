///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    'use strict';

    export class NotificationRepository {
        private notifications: Array<Notification> = [];

        add(notificationId: string, pullRequestLink: string): void {
            var prNotification = new PullRequestNotification();
            prNotification.notificationId = notificationId;
            prNotification.pullRequestHtmlLink = pullRequestLink;

            this.notifications.push(prNotification);
        }

        getAll(): Array<Notification> {
            return this.notifications;
        }

        find(notificationId: string): Notification {
            for (var notifIdx = 0, notifLen = this.notifications.length; notifIdx < notifLen; notifIdx++) {
                var notification = this.notifications[notifIdx];
                if (notification.notificationId === notificationId) {
                    return notification;
                }
            }

            return new PullRequestNotification();
        }
    }
}
