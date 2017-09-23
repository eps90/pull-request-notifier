import * as angular from 'angular';
import {AnalyticsEventDispatcher} from '../../../app/services/analytics_event_dispatcher';
import {SampleEvent} from './mock/sample_event';
import {ExtendedEvent} from './mock/extended_event';

describe('AnalyticsEventDispatcher', () => {
    let eventDispatcher: AnalyticsEventDispatcher;
    let analyticsService: angular.google.analytics.AnalyticsService;

    beforeEach(angular.mock.module('bitbucketNotifier'));
    beforeEach(angular.mock.module([
        '$provide',
        ($provide: ng.auto.IProvideService) => {
            $provide.value('Analytics', {
                trackEvent: jasmine.createSpy('Analytics.trackEvent')
            });
        }
    ]));
    beforeEach(angular.mock.inject([
        'AnalyticsEventDispatcher',
        'Analytics',
        (e, a) => {
            eventDispatcher = e;
            analyticsService = a;
        }
    ]));

    it('should send an event from an object', () => {
        const analyticsEvent = new SampleEvent();
        eventDispatcher.dispatch(analyticsEvent);
        expect(analyticsService.trackEvent).toHaveBeenCalledWith('Some category', 'Some action', 'Some label');
    });

    it('should send an extended event from an object', () => {
        const extendedEvent = new ExtendedEvent();
        eventDispatcher.dispatch(extendedEvent);
        expect(analyticsService.trackEvent).toHaveBeenCalledWith(
            'Some category',
            'Some action',
            'Some label',
            999,
            true,
            {dimension1: 1}
        );
    });
});
