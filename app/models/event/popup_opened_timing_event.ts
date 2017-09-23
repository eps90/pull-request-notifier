import {TimingEventInterface} from '../analytics_event/timing_event';

export class PopupOpenedTimingEvent implements TimingEventInterface {
    public getCategory(): string {
        return 'Popup';
    }

    public getVariable(): string {
        return 'opened';
    }
}
