///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    export class Config {
        static $inject = ['localStorageService'];

        constructor(private localStorageService: angular.local.storage.ILocalStorageService) {}

        getUsername() {
            return this.localStorageService.get(ConfigObject.USER);
        }

        setUsername(username: string) {
            this.localStorageService.set(ConfigObject.USER, username);
        }

        getSocketServerAddress() {
            var address: string = <string>this.localStorageService.get(ConfigObject.SOCKET_SERVER);
            var addressWithHttp = _.trimLeft(address, 'http://');
            return 'http://' + addressWithHttp;
        }

        setSocketServerAddress(socketServerAddress: string) {
            this.localStorageService.set(ConfigObject.SOCKET_SERVER, socketServerAddress);
        }
    }
}
