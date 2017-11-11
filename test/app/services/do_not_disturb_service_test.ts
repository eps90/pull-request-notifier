import * as angular from 'angular';
import {DoNotDisturbService} from '../../../app/services/do_not_disturb_service';
import {Config} from '../../../app/services/config';
import {Duration} from '../../../app/services/dnd/duration';
import {MINUTES} from '../../../app/services/dnd/duration_unit';

describe('DoNotDisturbService', () => {
    let dndService: DoNotDisturbService;
    let config: Config|any;
    const currentTimeMock = new Date('2017-01-03 12:00:00');

    beforeEach(function mockTime() {
        jasmine.clock().install();
        jasmine.clock().mockDate(currentTimeMock);
    });

    afterEach(function bringBackTime() {
        jasmine.clock().uninstall();
    });

    beforeEach(angular.mock.module('bitbucketNotifier'));
    beforeEach(angular.mock.module([
        '$provide',
        ($provide: ng.auto.IProvideService) => {
            $provide.value('Config', {
                dndTime: null,
                setDndToTime: (time) => this.dndTime = time,
                clearDndToTime: () => this.dndTime = null,
                getDndToTime: () => this.dndTime
            });
        }
    ]));
    beforeEach(inject([
        'DndService',
        'Config',
        (dnd, c) => {
            dndService = dnd;
            config = c;
        }
    ]));

    it('should turn on DND mode for defined duration', () => {
        const dndDuration = new Duration(5, MINUTES);
        dndService.turnOnDnd(dndDuration);

        const expectedEndDate = (new Date('2017-01-03 12:05:00')).getTime();
        const actualEndDate = config.getDndToTime();

        expect(actualEndDate).toEqual(expectedEndDate);
    });

    it('should be able to turn off DND', () => {
        dndService.turnOffDnd();
        expect(config.getDndToTime()).toBeNull();
    });

    it('should determine if DND is active yet', () => {
        const dndDuration = new Duration(5, MINUTES);
        dndService.turnOnDnd(dndDuration);

        expect(dndService.isDndOn()).toBeTruthy();
    });

    it('should not be on if set DND timeout expired', () => {
        const dndDuration = new Duration(5, MINUTES);
        dndService.turnOnDnd(dndDuration);

        jasmine.clock().mockDate(new Date('2017-01-03 12:10:00'));

        expect(dndService.isDndOn()).toBeFalsy();
    });
});
