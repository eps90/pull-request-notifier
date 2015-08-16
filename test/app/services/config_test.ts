///<reference path="../../../app/_typings.ts"/>

fdescribe('Config', () => {
    var config: BitbucketNotifier.Config,
        localStorageService: angular.local.storage.ILocalStorageService;

    beforeEach(module('bitbucketNotifier'));
    beforeEach(inject([
        'Config',
        'localStorageService',
        (c, l) => {
            config = c;
            localStorageService = l;
        }
    ]));

    beforeEach(() => {
        localStorageService.clearAll();
    });

    it('should be able to fetch config variables from local storage', () => {
        var key = 'some_key';
        var value = 'some_value';
        localStorageService.set(key, value);
        expect(config.getParameter(key)).toEqual(value);
    });
});
