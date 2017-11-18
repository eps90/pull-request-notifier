import {ConfigStorageInterface} from '../../../../app/services/config/config_storage';
import {InMemoryConfigStorage} from '../../../../app/services/config/in_memory_config_storage';
import {Config} from '../../../../app/services/config/config';

fdescribe('Config', () => {
    let configStorage: ConfigStorageInterface;
    let config: Config;

    beforeEach(() => {
        const store = new Map([
            ['host', 'http://localhost'],
            ['user', 'admin'],
            ['language', 'en']
        ]);
        const defaults = new Map([
            ['sounds.new_pr', 'new_pr_sound.mp3']
        ]);
        configStorage = new InMemoryConfigStorage(store);
        config = new Config(configStorage, defaults);
    });

    it('should get item from storage', () => {
        expect(config.getItem('host')).toEqual('http://localhost');
    });

    it('should return default value if item has not been found', () => {
        expect(config.getItem('sounds.new_pr')).toEqual('new_pr_sound.mp3');
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
