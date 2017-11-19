import {ConfigStorageInterface} from './config_storage';
import {Config} from './config';

export class ConfigProvider implements ng.IServiceProvider {
    public $get = ['config.storage', (storage: ConfigStorageInterface) => {
        const configStorage = this.customStorage || storage;
        const defaults = this.serviceDefaults || new Map();
        return new Config(configStorage, defaults);
    }];

    private serviceDefaults: Map<string, any>;
    private customStorage: ConfigStorageInterface;

    public setDefaults(defaults: Map<string, any>): void {
        this.serviceDefaults = defaults;
    }

    public useCustomStorage(storage: ConfigStorageInterface) {
        this.customStorage = storage;
    }
}
