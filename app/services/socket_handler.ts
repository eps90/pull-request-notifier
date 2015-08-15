///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    export class SocketHandler {
        static $inject = ['Socket', 'localStorageService'];
        constructor(private socket, private localStorageService: angular.local.storage.ILocalStorageService) {
            this.initListeners();
        }

        private initListeners() {
            this.socket.on('connect', () => {
                var loggedInUser = this.localStorageService.get('app:user');
                this.socket.emit('client:introduce', loggedInUser);
            });
        }
    }
}
