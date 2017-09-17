import {AnalyticsEventInterface} from './analytics_event';

export class PullRequestOpenedEvent implements AnalyticsEventInterface {
    private constructor(private clickSource: string) {}

    public static fromNotification(): PullRequestOpenedEvent {
        return new this('NOTIFICATION');
    }

    public getCategory(): string {
        return 'Pull request link';
    }

    public getAction(): string {
        return 'opened';
    }

    public getLabel(): string {
        return this.clickSource;
    }
}
