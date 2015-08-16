///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    export class Config {
        static $inject = ['localStorageService'];

        constructor(private localStorageService: angular.local.storage.ILocalStorageService) {}
        getParameter(key: string) {
            return this.localStorageService.get(key);
        }

        getUsername() {
            return this.localStorageService.get(ConfigObject.USER);
        }
    }
}
