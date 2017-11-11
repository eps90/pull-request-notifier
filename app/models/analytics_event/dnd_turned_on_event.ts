import {AnalyticsEventInterface} from './analytics_event';
import {Duration} from '../../services/dnd/duration';

export class DndTurnedOnEvent implements AnalyticsEventInterface {
    private constructor(private duration: Duration) {}

    public static turnedOnFor(duration: Duration) {
        return new this(duration);
    }

    public getCategory(): string {
        return 'DND_MODE';
    }

    public getAction(): string {
        return 'TURNED_ON';
    }

    public getLabel(): string {
        return String(this.duration);
    }
}
