import {AnalyticsEventInterface} from '../models/analytics_event/analytics_event';
import {ExtendedAnalyticsEventInterface} from '../models/analytics_event/extended_analytics_event';

export class AnalyticsEventDispatcher {
    public static $inject: string[] = ['Analytics'];

    constructor(private analytics: angular.google.analytics.AnalyticsService) {}

    public dispatch(event: AnalyticsEventInterface): void {
        if (isExtendedEvent(event)) {
            this.analytics.trackEvent(
                event.getCategory(),
                event.getAction(),
                event.getLabel(),
                event.getValue(),
                event.isNonInteractive(),
                event.getDimensions()
            );
        } else {
            this.analytics.trackEvent(
                event.getCategory(),
                event.getAction(),
                event.getLabel()
            );
        }
    }
}

function isExtendedEvent(
    event: AnalyticsEventInterface | ExtendedAnalyticsEventInterface
): event is ExtendedAnalyticsEventInterface {
    return (event as ExtendedAnalyticsEventInterface).getValue !== undefined;
}
