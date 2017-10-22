export function setUpI18n(application: ng.IModule): void {
    application.config([
        '$translateProvider',
        ($translateProvider: angular.translate.ITranslateProvider) => {
            $translateProvider
                .translations('en', require('./../lang/en.json'))
                .registerAvailableLanguageKeys(
                    ['en'],
                    {
                        'en_*': 'en',
                        'en-*': 'en',
                        '*': 'en'
                    }
                )
                .determinePreferredLanguage()
                .useSanitizeValueStrategy('escape')
                .useMissingTranslationHandlerLog();
        }
    ]);
}
