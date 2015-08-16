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

        getSocketServerAddress() {
            var address: string = <string>this.localStorageService.get(ConfigObject.SOCKET_SERVER);
            var addressWithHttp = _.trimLeft(address, 'http://');
            return 'http://' + addressWithHttp;
        }
    }
}
