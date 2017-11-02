import {Language} from '../../models/language';

export interface LanguageRepositoryInterface {
    findDefault(): Language;
    findAll(): Language[];
}
