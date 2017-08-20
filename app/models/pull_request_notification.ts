import {NotificationInterface} from './notification_interface';

export class PullRequestNotification implements NotificationInterface {
    public notificationId: string = '';
    public pullRequestHtmlLink: string = '';
}
