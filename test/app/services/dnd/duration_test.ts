import {MINUTES} from '../../../../app/services/dnd/duration_unit';
import {Duration} from '../../../../app/services/dnd/duration';

describe('Duration', () => {
    it('should create a valid duration object', () => {
        const durationValue = 5;
        const durationUnit = MINUTES;

        const duration = new Duration(durationValue, durationUnit);

        expect(duration.value).toEqual(durationValue);
        expect(duration.unit).toEqual(durationUnit);
    });

    it('should throw when value is less than zero', () => {
        expect(() => {new Duration(-1, MINUTES); }).toThrow();
    });

    it('should throw when unit is invalid', () => {
        expect(() => {new Duration(100, 'invalid unit'); }).toThrow();
    });

    it('should be able to be casted to string', () => {
        const someDuration = new Duration(10, MINUTES);
        const expectedString = '10 minutes';
        const actualString = String(someDuration);

        expect(actualString).toEqual(expectedString);
    });
});
