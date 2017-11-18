export interface ConfigStorageInterface {
    getItem(itemKey: string): any;
    hasItem(itemKey: string): boolean;
    removeItem(itemKey: string): void;
    allItems(): Map<string, any>;
    save(config: Map<string, any>): void;
    clear(): void;
}
