import {LanguageRepositoryInterface} from './language_repository_interface';
import {Language} from '../../models/language';

export class LanguageRepository implements LanguageRepositoryInterface {
    public static $inject: string[] = ['languages'];

    constructor(private langs: Language[]) {}

    public findDefault(): Language {
        for (const lang of this.langs) {
            if (lang.isDefault) {
                return lang;
            }
        }

        throw new Error('No default language provided');
    }

    public findAll(): Language[] {
        return this.langs;
    }
}
