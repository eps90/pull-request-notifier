import * as angular from 'angular';
import {ConfigStorageInterface} from '../../../../app/services/config/config_storage';
import {InMemoryConfigStorage} from '../../../../app/services/config/in_memory_config_storage';
import {Config} from '../../../../app/services/config/config';
import {ConfigProvider} from '../../../../app/services/config/config_provider';

describe('Config', () => {
    let configStorage: ConfigStorageInterface;
    let config: Config;

    beforeEach(angular.mock.module('eps.config'));
    beforeEach(angular.mock.module([
        '$provide',
        'configProvider',
        ($provide: ng.auto.IProvideService, configProvider: ConfigProvider) => {
            $provide.service('config.storage', InMemoryConfigStorage);
            const defaults = new Map([
                ['sounds.new_pr', 'new_pr_sound.mp3']
            ]);
            configProvider.setDefaults(defaults);
        }
    ]));
    beforeEach(angular.mock.inject([
        'config',
        'config.storage',
        (c, cs) => {
            config = c;
            configStorage = cs;
        }
    ]));
    beforeEach(() => {
        const store = new Map([
            ['host', 'http://localhost'],
            ['user', 'admin'],
            ['language', 'en']
        ]);
        configStorage.save(store);
    });

    it('should get item from storage', () => {
        expect(config.getItem('host')).toEqual('http://localhost');
    });

    it('should return default value if item has not been found', () => {
        expect(config.getItem('sounds.new_pr')).toEqual('new_pr_sound.mp3');
    });

    it('shold save single item', () => {
        config.setItem('someKey', 'someValue');
        expect(config.getItem('someKey')).toEqual('someValue');
    });

    it('should remove single item', () => {
        config.removeItem('host');
        expect(configStorage.hasItem('host')).toBeFalsy();
    });

    it('should save new config', (done) => {
        const newConfig = new Map([
            ['host', 'http://myhost.com'],
            ['user', 'admin'],
            ['language', 'en']
        ]);

        config.save(newConfig).then(() => {
            expect(config.getItem('host')).toEqual('http://myhost.com');
            done();
        });
    });
});
