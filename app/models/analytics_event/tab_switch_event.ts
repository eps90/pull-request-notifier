import {AnalyticsEventInterface} from './analytics_event';

export class TabSwitchEvent implements AnalyticsEventInterface {
    private constructor(private tabName: string) {}

    public static authoredPullRequestsTab(): TabSwitchEvent {
        return new this('AUTHORED_PR');
    }

    public static assignedPullRequestsTab(): TabSwitchEvent {
        return new this('ASSIGNED_PR');
    }

    public getCategory(): string {
        return 'Pull request tabs';
    }

    public getAction(): string {
        return 'switch';
    }

    public getLabel(): string {
        return this.tabName;
    }
}
