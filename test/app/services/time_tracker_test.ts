import * as angular from 'angular';
import {TimeTracker} from '../../../app/services/time_tracker';
import {SampleTiming} from './mock/sample_timing';
import {SampleTimingWithKey} from './mock/sample_timing_with_key';

describe('Time tracker', () => {
    let timeTracker: TimeTracker;
    let analytics: angular.google.analytics.AnalyticsService;

    beforeEach(angular.mock.module('bitbucketNotifier'));
    beforeEach(angular.mock.module([
        '$provide',
        ($provide: ng.auto.IProvideService) => {
            $provide.value('Analytics', {
                trackTimings: jasmine.createSpy('Analytics.trackTimings')
            });
        }
    ]));
    beforeEach(angular.mock.inject([
        'TimeTracker',
        'Analytics',
        (tt, a) => {
            timeTracker = tt;
            analytics = a;
        }
    ]));
    beforeEach(() => {
        jasmine.clock().install();
    });
    afterEach(() => {
        jasmine.clock().uninstall();
    });

    it('should track event by name', () => {
        const startDate = new Date(2017, 0, 1, 12, 0, 0, 0);
        jasmine.clock().mockDate(startDate);

        const timingEvent = new SampleTiming();
        timeTracker.start(timingEvent);

        const timeDelta = 100;
        jasmine.clock().tick(timeDelta);

        timeTracker.stop(timingEvent);

        expect(analytics.trackTimings).toHaveBeenCalledWith(
            timingEvent.getCategory(),
            timingEvent.getVariable(),
            timeDelta
        );
    });

    it('should do nothing if event was not started', () => {
        const timingEvent = new SampleTiming();
        timeTracker.stop(timingEvent);

        expect(analytics.trackTimings).not.toHaveBeenCalled();
    });

    it('should not track the same event twice', () => {
        const startDate = new Date(2017, 0, 1, 12, 0, 0, 0);
        jasmine.clock().mockDate(startDate);

        const timingEvent = new SampleTiming();
        timeTracker.start(timingEvent);

        const timeDelta = 100;
        jasmine.clock().tick(timeDelta);

        timeTracker.stop(timingEvent);
        timeTracker.stop(timingEvent);

        expect(analytics.trackTimings).toHaveBeenCalledTimes(1);
    });

    it('should handle key aware events', () => {
        const startDate = new Date(2017, 0, 1, 12, 0, 0, 0);
        jasmine.clock().mockDate(startDate);

        const timingEventWithKey = new SampleTimingWithKey();
        const timingEvent = new SampleTiming();

        timeTracker.start(timingEventWithKey);

        const timeDelta = 100;
        jasmine.clock().tick(timeDelta);
        timeTracker.stop(timingEvent);

        const newTimeDelta = 150;
        jasmine.clock().tick(newTimeDelta);
        timeTracker.stop(timingEventWithKey);

        expect(analytics.trackTimings).toHaveBeenCalledWith(
            timingEventWithKey.getCategory(),
            timingEventWithKey.getVariable(),
            timeDelta + newTimeDelta
        );
    });
});
