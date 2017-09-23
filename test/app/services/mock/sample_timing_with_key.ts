import {TimingEventKeyAwareInterface} from '../../../../app/models/analytics_event/timing_event_key_aware';

export class SampleTimingWithKey implements TimingEventKeyAwareInterface {
    public getEventKey(): string {
        return 'EventKey!@#';
    }

    public getCategory(): string {
        return 'Sample';
    }

    public getVariable(): string {
        return 'Timing';
    }

}
