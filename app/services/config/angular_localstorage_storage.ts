import {ConfigStorageInterface} from './config_storage';

export class AngularLocalStorageStorage implements ConfigStorageInterface {
    constructor(private localStorageService: angular.local.storage.ILocalStorageService) {}

    public getItem(itemKey: string): any {
        return this.localStorageService.get(itemKey);
    }

    public hasItem(itemKey: string): boolean {
        return this.localStorageService.get(itemKey) !== null;
    }

    public removeItem(itemKey: string): void {
        this.localStorageService.remove(itemKey);
    }

    public allItems(): Map<string, any> {
        const result = new Map();
        for (const lsKey of this.localStorageService.keys()) {
            result.set(lsKey, this.localStorageService.get(lsKey));
        }

        return result;
    }

    public save(config: Map<string, any>): void {
        this.localStorageService.clearAll();
        config.forEach((value, key) => {
            this.localStorageService.set(key, value);
        });
    }

    public clear(): void {
        this.localStorageService.clearAll();
    }
}
