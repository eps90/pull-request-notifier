import {Config} from './config';
import {Duration} from './dnd/duration';
import * as moment from 'moment';
import {AnalyticsEventDispatcher} from './analytics_event_dispatcher';
import {DndTurnedOnEvent} from '../models/analytics_event/dnd_turned_on_event';
import {DndTurnedOffEvent} from '../models/analytics_event/dnd_turned_off_event';

export class DoNotDisturbService {
    public static $inject: string[] = ['Config', 'AnalyticsEventDispatcher'];

    constructor(private config: Config, private analyticsEventDispatcher: AnalyticsEventDispatcher) {}

    public turnOnDnd(duration: Duration): void {
        const currentDate = moment();
        const dndEndTime = currentDate.add(
            duration.value as moment.DurationInputArg1,
            duration.unit as moment.DurationInputArg2
        );

        this.config.setDndToTime(dndEndTime.valueOf());
        this.analyticsEventDispatcher.dispatch(DndTurnedOnEvent.turnedOnFor(duration));
    }

    public turnOffDnd(): void {
        this.config.clearDndToTime();
        this.analyticsEventDispatcher.dispatch(new DndTurnedOffEvent());
    }

    public isDndOn(): boolean {
        const dndToTime = this.config.getDndToTime();
        return moment().isSameOrBefore(dndToTime);
    }
}
