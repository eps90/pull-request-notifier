import {AnalyticsEventInterface} from '../../../../app/models/analytics_event/analytics_event';

export class SampleEvent implements AnalyticsEventInterface {
    public getCategory(): string {
        return 'Some category';
    }

    public getAction(): string {
        return 'Some action';
    }

    public getLabel(): string {
        return 'Some label';
    }
}
