import {TimingEventInterface} from '../../../../app/models/analytics_event/timing_event';

export class SampleTiming implements TimingEventInterface {
    public getCategory(): string {
        return 'Sample';
    }

    public getVariable(): string {
        return 'Timing';
    }
}
