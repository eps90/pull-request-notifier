import {TimingEventInterface} from '../models/analytics_event/timing_event';
import {TimingEventKeyAwareInterface} from '../models/analytics_event/timing_event_key_aware';

export class TimeTracker {
    public static $inject: string[] = ['Analytics'];
    private timings: {[key: string]: number};

    constructor(private analytics: angular.google.analytics.AnalyticsService) {
        this.timings = {};
    }

    public start(timingEvent: TimingEventInterface): void {
        const timingEventKey = isKeyAware(timingEvent)
            ? timingEvent.getEventKey()
            : buildEventKey(timingEvent);
        this.timings[timingEventKey] = new Date().getTime();
    }

    public stop(timingEvent: TimingEventInterface): void {
        const timingEventKey = isKeyAware(timingEvent)
            ? timingEvent.getEventKey()
            : buildEventKey(timingEvent);

        if (!this.timings.hasOwnProperty(timingEventKey)) {
            return;
        }

        const startDate = this.timings[timingEventKey];
        const endDate = new Date().getTime();
        const timeDelta = endDate - startDate;

        this.analytics.trackTimings(
            timingEvent.getCategory(),
            timingEvent.getVariable(),
            timeDelta
        );

        delete this.timings[timingEventKey];
    }
}

function isKeyAware(event: TimingEventInterface | TimingEventKeyAwareInterface): event is TimingEventKeyAwareInterface {
    return (event as TimingEventKeyAwareInterface).getEventKey !== undefined;
}

function buildEventKey(timingEvent: TimingEventInterface): string {
    return `${timingEvent.getCategory()}.${timingEvent.getVariable()}`;
}
