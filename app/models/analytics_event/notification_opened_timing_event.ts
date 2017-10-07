import {TimingEventKeyAwareInterface} from './timing_event_key_aware';

export class NotificationOpenedTimingEvent implements TimingEventKeyAwareInterface {
    private constructor(private notificationType: string, private notificationId: string) {}

    public static onNewPullRequest(notificationId: string): NotificationOpenedTimingEvent {
        return new this('PULL_REQUEST.NEW', notificationId);
    }

    public static onMergedPullRequest(notificationId: string): NotificationOpenedTimingEvent {
        return new this('PULL_REQUEST.MERGED', notificationId);
    }

    public static onApprovedPullRequest(notificationId: string): NotificationOpenedTimingEvent {
        return new this('PULL_REQUEST.APPROVED', notificationId);
    }

    public static onUpdatedPullRequest(notificationId: string): NotificationOpenedTimingEvent {
        return new this('PULL_REQUEST.UPDATED', notificationId);
    }

    public static onCommentInPullRequest(notificationId: string): NotificationOpenedTimingEvent {
        return new this('PULL_REQUEST.COMMENTED', notificationId);
    }

    public static onRepliedCommentInPullRequest(notificationId: string): NotificationOpenedTimingEvent {
        return new this('PULL_REQUEST.REPLIED', notificationId);
    }

    public static onRemindAlert(notificationId: string): NotificationOpenedTimingEvent {
        return new this('PULL_REQUEST.REMINDED', notificationId);
    }

    public static onClosed(notificationId: string): NotificationOpenedTimingEvent {
        return new this('', notificationId);
    }

    public getEventKey(): string {
        return `Notification.opened.${this.notificationId}`;
    }

    public getCategory(): string {
        return 'Notification is opened';
    }

    public getVariable(): string {
        return this.notificationType;
    }
}
