import * as angular from 'angular';
import {Language} from '../../../../app/models/language';
import {LanguageRepository} from '../../../../app/services/language_repository/language_repository';
import {languages} from '../mock/languages';

describe('Language Repository', () => {
    const definedLanguages = languages;
    let languageRepository: LanguageRepository;

    beforeEach(angular.mock.module('bitbucketNotifier'));
    beforeEach(angular.mock.module([
        '$provide',
        ($provide: ng.auto.IProvideService) => {
            $provide.value('languages', definedLanguages);
        }
    ]));
    beforeEach(angular.mock.inject([
        'LanguageRepository',
        ($lr) => {
            languageRepository = $lr;
        }
    ]));

    it('should return all languages', () => {
        const foundLangs = languageRepository.findAll();
        expect(foundLangs).toEqual(definedLanguages);
    });

    it('should find the default language', () => {
        const expectedLanguage = definedLanguages[0];
        const actualLanguage = languageRepository.findDefault();

        expect(expectedLanguage).toEqual(actualLanguage);
    });

    it('should throw when default language has not been found', () => {
        const langsWithoutDefault = [
            new Language('en', 'English'),
            new Language('de', 'German'),
            new Language('fr', 'French'),
        ];
        const newRepo = new LanguageRepository(langsWithoutDefault);

        expect(() => { newRepo.findDefault(); }).toThrow();
    });
});
