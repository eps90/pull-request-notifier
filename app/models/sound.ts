export class Sound {
    constructor(private _id: string, private _soundPath: string, private _label: string) {}

    get id(): string {
        return this._id;
    }

    get soundPath(): string {
        return this._soundPath;
    }

    get label(): string {
        return this._label;
    }
}
