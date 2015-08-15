///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    export class SocketHandler {
        static $inject = ['Socket', 'localStorageService', 'PullRequestRepository'];
        constructor(
            private socket,
            private localStorageService: angular.local.storage.ILocalStorageService,
            private pullRequestRepository: BitbucketNotifier.PullRequestRepository
        ) {
            this.initListeners();
        }

        private initListeners() {
            this.socket.on('connect', () => {
                var loggedInUser = this.localStorageService.get('app:user');
                this.socket.emit('client:introduce', loggedInUser);
            });

            this.socket.on('server:pullrequests:updated', (userPrs: BitbucketNotifier.PullRequestEvent) => {
                this.pullRequestRepository.pullRequests = userPrs.pullRequests;
            });
        }
    }
}
