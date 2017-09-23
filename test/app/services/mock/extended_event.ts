import {ExtendedAnalyticsEventInterface} from '../../../../app/models/analytics_event/extended_analytics_event';

export class ExtendedEvent implements ExtendedAnalyticsEventInterface {
    public getValue(): number {
        return 999;
    }

    public getDimensions(): { [p: string]: any } {
        return {dimension1: 1};
    }

    public isNonInteractive(): boolean {
        return true;
    }

    public getCategory(): string {
        return 'Some category';
    }

    public getAction(): string {
        return 'Some action';
    }

    public getLabel(): string {
        return 'Some label';
    }

}
