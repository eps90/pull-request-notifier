import {LangMetaFileInterface} from '../models/lang_meta_file_interface';
import {TranslationInterface} from '../models/translation_interface';
import {Language} from '../models/language';

export function setUpI18n(application: ng.IModule): void {
    application.config([
        '$translateProvider',
        ($translateProvider: angular.translate.ITranslateProvider) => {
            const translations = loadTranslations();
            configureTranslations(translations, $translateProvider);
            $translateProvider
                .determinePreferredLanguage()
                .useSanitizeValueStrategy('escape')
                .useMissingTranslationHandlerLog();
        }
    ]);
}

export function getLanguages(): Language[] {
    const translations = loadTranslations();
    return translations.map((translation: TranslationInterface) => {
        return new Language(
            translation.code,
            translation.name,
            translation.isDefault
        );
    });
}

function loadTranslations(): TranslationInterface[] {
    const langContext = require.context('../lang', true, /\.json$/);
    const metaFileNamePattern = /meta\.json$/;
    const metaFilePaths = langContext.keys()
        .filter(jsonPath => jsonPath.match(metaFileNamePattern));

    const translations: TranslationInterface[] = [];

    metaFilePaths.forEach((metaFilePath) => {
        const metaFile = langContext(metaFilePath) as LangMetaFileInterface;
        const metaDirName = metaFilePath.replace(metaFileNamePattern, '');

        let currentLanguage = {};
        metaFile.files.forEach((fileName) => {
            const langFullPath = metaDirName + fileName;
            const langLoaded = langContext(langFullPath);
            currentLanguage = {...currentLanguage, ...langLoaded};
        });

        translations.push({
            code: metaFile.code,
            name: metaFile.name,
            translations: currentLanguage,
            availableKeys: metaFile.availableKeys || [],
            isDefault: metaFile.isDefault || false
        });
    });

    return translations;
}

function configureTranslations(
    translations: TranslationInterface[],
    provider: angular.translate.ITranslateProvider
): void {
    const availableKeys = {};
    const availableLanguages: string[] = [];

    translations.forEach((translation) => {
        availableLanguages.push(translation.code);
        provider.translations(translation.code, translation.translations);
        translation.availableKeys.forEach((availableKey) => {
            availableKeys[availableKey] = translation.code;
        });
        if (translation.isDefault) {
            assertDefaultLanguageIsNotReassigned(availableKeys);
            availableKeys['*'] = translation.code;
        }
    });

    provider.registerAvailableLanguageKeys(availableLanguages, availableKeys);
}

function assertDefaultLanguageIsNotReassigned(availableKeys: any) {
    if (availableKeys.hasOwnProperty('*')) {
        throw Error('Trying to override default language!');
    }
}
