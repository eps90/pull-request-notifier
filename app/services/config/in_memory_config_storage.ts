import {ConfigStorageInterface} from './config_storage';

export class InMemoryConfigStorage implements ConfigStorageInterface {
    private storage: Map<string, any>;

    constructor(private initialStore = new Map()) {
        this.storage = initialStore;
    }

    public getItem(itemKey: string): any {
        return this.storage.get(itemKey);
    }

    public setItem(itemKey: string, itemValue: any): void {
        this.storage.set(itemKey, itemValue);
    }

    public hasItem(itemKey: string): boolean {
        return this.storage.has(itemKey);
    }

    public removeItem(itemKey: string): void {
        this.storage.delete(itemKey);
    }

    public allItems(): Map<string, any> {
        return this.storage;
    }

    public save(config: Map<string, any>): void {
        this.storage = config;
    }

    public clear(): void {
        this.storage.clear();
    }
}
