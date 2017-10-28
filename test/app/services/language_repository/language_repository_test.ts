import * as angular from 'angular';
import {Language} from '../../../../app/models/language';
import {LanguageRepository} from '../../../../app/services/language_repository/language_repository';

describe('Language Repository', () => {
    const languages = [
        new Language('en', 'English', true),
        new Language('de', 'German'),
        new Language('fr', 'French')
    ];
    let languageRepository: LanguageRepository;

    beforeEach(angular.mock.module('bitbucketNotifier'));
    beforeEach(angular.mock.module([
        '$provide',
        ($provide: ng.auto.IProvideService) => {
            $provide.value('languages', languages);
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
        expect(foundLangs).toEqual(languages);
    });

    it('should find the default language', () => {
        const expectedLanguage = languages[0];
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
