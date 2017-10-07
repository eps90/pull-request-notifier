import {AnalyticsEventInterface} from './analytics_event';

export class PullRequestOpenedEvent implements AnalyticsEventInterface {
    private constructor(private clickSource: string) {}

    public static fromNotification(): PullRequestOpenedEvent {
        return new this('NOTIFICATION');
    }

    public static fromPullRequestList(): PullRequestOpenedEvent {
        return new this('PULL_REQUEST_LIST');
    }

    public static fromPullRequestPreview(): PullRequestOpenedEvent {
        return new this('PULL_REQUEST_PREVIEW');
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
