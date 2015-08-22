///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    'use strict';

    // @todo Are the setters event necessary here?
    export class Config {
        static $inject: Array<string> = ['localStorageService'];

        constructor(private localStorageService: angular.local.storage.ILocalStorageService) {}

        getUsername(): string {
            return this.localStorageService.get(ConfigObject.USER);
        }

        setUsername(username: string): void {
            this.localStorageService.set(ConfigObject.USER, username);
        }

        getSocketServerAddress(): string {
            var address: string = <string>this.localStorageService.get(ConfigObject.SOCKET_SERVER);
            var addressWithHttp = _.trimLeft(address, 'http://');
            return 'http://' + addressWithHttp;
        }

        setSocketServerAddress(socketServerAddress: string): void {
            this.localStorageService.set(ConfigObject.SOCKET_SERVER, socketServerAddress);
        }
    }
}
