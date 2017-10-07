import {TimingEventInterface} from './timing_event';

export class TrackingItem {
    constructor(
        private _event: TimingEventInterface,
        private _startTime: number
    ) {}

    get event(): TimingEventInterface {
        return this._event;
    }

    get startTime(): number {
        return this._startTime;
    }
}
