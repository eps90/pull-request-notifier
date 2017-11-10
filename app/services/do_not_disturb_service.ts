import {Config} from './config';
import {Duration} from './dnd/duration';
import * as moment from 'moment';

export class DoNotDisturbService {
    public static $inject: string[] = ['Config'];

    constructor(private config: Config) {}

    public turnOnDnd(duration: Duration): void {
        const currentDate = moment();
        const dndEndTime = currentDate.add(
            duration.value as moment.DurationInputArg1,
            duration.unit as moment.DurationInputArg2
        );

        this.config.setDndToTime(dndEndTime.valueOf());
    }

    public turnOffDnd(): void {
        this.config.clearDndToTime();
    }

    public isDndOn(): boolean {
        const dndToTime = this.config.getDndToTime();
        return moment().isSameOrBefore(dndToTime);
    }
}
