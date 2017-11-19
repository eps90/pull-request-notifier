export interface ConfigStorageInterface {
    getItem(itemKey: string): any;
    setItem(itemKey: string, itemValue: any): void;
    hasItem(itemKey: string): boolean;
    removeItem(itemKey: string): void;
    allItems(): Map<string, any>;
    save(config: Map<string, any>): void;
    clear(): void;
}
