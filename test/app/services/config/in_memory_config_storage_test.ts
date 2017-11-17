import {InMemoryConfigStorage} from '../../../../app/services/config/in_memory_config_storage';

describe('InMemoryConfigStorage', () => {
    let storage: InMemoryConfigStorage;
    let storageItems: Map<string, any>;

    beforeEach(() => {
        storageItems = new Map([
            ['host', 'http://localhost'],
            ['user', 'admin'],
            ['language', 'en']
        ]);
        storage = new InMemoryConfigStorage(storageItems);
    });

    it('should get all values', () => {
        expect(storage.allItems()).toEqual(storageItems);
    });

    it('should get an item with a key', () => {
        expect(storage.getItem('user')).toEqual('admin');
    });

    it('should determine if storage has value', () => {
        expect(storage.hasItem('password')).toBeFalsy();
        expect(storage.hasItem('user')).toBeTruthy();
    });

    it('should be able to delete a key in a storage', () => {
        storage.removeItem('host');
        expect(storage.hasItem('host')).toBeFalsy();
    });
});
