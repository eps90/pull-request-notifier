import * as angular from 'angular';
import {AngularLocalStorageStorage} from '../../../../app/services/config/angular_localstorage_storage';

describe('AngularLocalStorageStorage', () => {
    let storage: AngularLocalStorageStorage;
    let localStorageService: angular.local.storage.ILocalStorageService;

    beforeEach(angular.mock.module('eps.config'));
    beforeEach(angular.mock.inject([
        'config.storage.ngLocalStorage',
        'localStorageService',
        (s, ls) => {
            storage = s;
            localStorageService = ls;
        }
    ]));
    beforeEach(() => {
        localStorageService.clearAll();
    });

    it('should fetch single item', () => {
        const inputKey = 'someItem';
        const inputValue = 'someValue';
        localStorageService.set(inputKey, inputValue);

        expect(storage.getItem(inputKey)).toEqual(inputValue);
    });

    it('should determine whether it has an item', () => {
        localStorageService.set('someItem', 'someValue');
        expect(storage.hasItem('someItem')).toBeTruthy();
        expect(storage.hasItem('missingItem')).toBeFalsy();
    });

    it('should be able to remove an item', () => {
        localStorageService.set('someItem', 'someValue');
        storage.removeItem('someItem');
        expect(storage.hasItem('someItem')).toBeFalsy();
    });

    it('should get all items from storage', () => {
        localStorageService.set('someItem', 'someValue');
        localStorageService.set('otherItem', 'otherValue');

        const expectedItems = new Map([
            ['someItem', 'someValue'],
            ['otherItem', 'otherValue']
        ]);
        const actualItems = storage.allItems();

        expect(actualItems.entries()).toEqual(expectedItems.entries());
    });

    it('should remove all items from storage', () => {
        localStorageService.set('someItem', 'someValue');
        localStorageService.set('otherItem', 'otherValue');

        storage.clear();

        expect(storage.hasItem('someItem')).toBeFalsy();
        expect(storage.hasItem('otherItem')).toBeFalsy();
    });

    it('should save new config', () => {
        localStorageService.set('someItem', 'someValue');
        localStorageService.set('otherItem', 'otherValue');

        const newConfig = new Map([
            ['someItem', 'newValue'],
            ['newItem', 'yetAnotherNewValue']
        ]);
        storage.save(newConfig);

        expect(storage.allItems().entries()).toEqual(newConfig.entries());
    });
});
