export class Language {
    constructor(private _code: string, private _name: string, private _isDefault: boolean = false) {}

    get code(): string {
        return this._code;
    }

    get name(): string {
        return this._name;
    }

    get isDefault(): boolean {
        return this._isDefault;
    }
}
