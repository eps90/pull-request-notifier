import {ConfigStorageInterface} from './config_storage';

export class Config {
    constructor(private storage: ConfigStorageInterface, private defaults: Map<string, any> = new Map()) {}

    public getItem(itemKey: string): any {
        if (!this.storage.hasItem(itemKey)) {
            return this.defaults.get(itemKey);
        }

        return this.storage.getItem(itemKey);
    }

    public save(newConfig: Map<string, any>): Promise<any> {
        return new Promise((resolve) => {
            this.storage.save(newConfig);
            resolve();
        });
    }
}
