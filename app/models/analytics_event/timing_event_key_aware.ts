import {TimingEventInterface} from './timing_event';

export interface TimingEventKeyAwareInterface extends TimingEventInterface {
    getEventKey(): string;
}
