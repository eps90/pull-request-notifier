import * as durationUnit from './duration_unit';

export class Duration {
    constructor(private _value: number, private _unit: string) {
        this.assertValidDurationValue(_value);
        this.assertValidUnit(_unit);
    }

    get value(): number {
        return this._value;
    }

    get unit(): string {
        return this._unit;
    }

    private assertValidDurationValue(value: number) {
        if (value < 0) {
            throw new Error('Duration value must be greater or equal than zero');
        }
    }

    private assertValidUnit(unit: string) {
        const allowedUnits = Object.keys(durationUnit).map(k => durationUnit[k]);
        if (allowedUnits.indexOf(unit) === -1) {
            throw new Error('Invalid duration unit');
        }
    }
}
