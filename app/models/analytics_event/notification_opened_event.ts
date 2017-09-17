import {ExtendedAnalyticsEventInterface} from './extended_analytics_event';

export class NotificationOpenedEvent implements ExtendedAnalyticsEventInterface {
    private constructor(private notificationType: string) {}

    public static onNewPullRequest(): NotificationOpenedEvent {
        return new this('PULL_REQUEST.NEW');
    }

    public static onMergedPullRequest(): NotificationOpenedEvent {
        return new this('PULL_REQUEST.MERGED');
    }

    public static onApprovedPullRequest(): NotificationOpenedEvent {
        return new this('PULL_REQUEST.APPROVED');
    }

    public static onUpdatedPullRequest(): NotificationOpenedEvent {
        return new this('PULL_REQUEST.UPDATED');
    }

    public static onCommentInPullRequest(): NotificationOpenedEvent {
        return new this('PULL_REQUEST.COMMENTED');
    }

    public static onRepliedCommentInPullRequest(): NotificationOpenedEvent {
        return new this('PULL_REQUEST.REPLIED');
    }

    public static onRemindAlert(): NotificationOpenedEvent {
        return new this('PULL_REQUEST.REMINDED');
    }

    public getCategory(): string {
        return 'Notification';
    }

    public getAction(): string {
        return 'opened';
    }

    public getLabel(): string {
        return this.notificationType;
    }

    public getValue(): number {
        return undefined;
    }

    public getDimensions(): { [expr: string]: any; } {
        return undefined;
    }

    public isNonInteractive(): boolean {
        return true;
    }
}
