import * as angular from 'angular';

declare module 'angular' {
    export namespace google.analytics {
        interface AnalyticsService {
            trackTimings(timingCategory: string, timingVar: string, timingValue: number): void;
        }
    }
}
