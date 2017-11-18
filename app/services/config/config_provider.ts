import {ConfigStorageInterface} from './config_storage';
import {Config} from './config';

export class ConfigProvider implements ng.IServiceProvider {
    public $get = ['config.storage', (storage: ConfigStorageInterface) => {
        return new Config(storage, this.serviceDefaults || new Map());
    }];

    private serviceDefaults: Map<string, any>;

    public setDefaults(defaults: Map<string, any>): void {
        this.serviceDefaults = defaults;
    }
}
