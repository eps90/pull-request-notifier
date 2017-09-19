import {AnalyticsEventInterface} from './analytics_event';

export interface ExtendedAnalyticsEventInterface extends AnalyticsEventInterface {
    getValue(): number;
    getDimensions(): { [expr: string]: any };
    isNonInteractive(): boolean;
}
