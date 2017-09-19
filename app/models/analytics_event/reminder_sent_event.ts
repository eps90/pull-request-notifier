import {AnalyticsEventInterface} from './analytics_event';

export class ReminderSentEvent implements AnalyticsEventInterface {
    private constructor(private clickSource: string) {}

    public static fromPullRequestList(): ReminderSentEvent {
        return new this('PULL_REQUEST_LIST');
    }

    public static fromPullRequestPreview(): ReminderSentEvent {
        return new this('PULL_REQUEST_PREVIEW');
    }

    public getCategory(): string {
        return 'Reminder';
    }

    public getAction(): string {
        return 'sent';
    }

    public getLabel(): string {
        return this.clickSource;
    }

}
