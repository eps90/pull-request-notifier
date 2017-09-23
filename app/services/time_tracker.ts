import {TimingEventInterface} from '../models/analytics_event/timing_event';

export class TimeTracker {
    public static $inject: string[] = ['Analytics'];
    private timings: {[key: string]: number};

    constructor(private analytics: angular.google.analytics.AnalyticsService) {
        this.timings = {};
    }

    public start(timingEvent: TimingEventInterface): void {
        const timingEventKey = this.buildEventKey(timingEvent);
        this.timings[timingEventKey] = new Date().getTime();
    }

    public stop(timingEvent: TimingEventInterface): void {
        const timingEventKey = this.buildEventKey(timingEvent);

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

    private buildEventKey(timingEvent: TimingEventInterface) {
        return `${timingEvent.getCategory()}.${timingEvent.getVariable()}`;
    }
}
