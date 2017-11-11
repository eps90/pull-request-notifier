import {AnalyticsEventInterface} from './analytics_event';

export class DndTurnedOffEvent implements AnalyticsEventInterface {
    public getCategory(): string {
        return 'DND_MODE';
    }

    public getAction(): string {
        return 'TURNED_OFF';
    }

    public getLabel(): string {
        return '';
    }
}
