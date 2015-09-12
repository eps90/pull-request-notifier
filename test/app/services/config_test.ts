///<reference path="../../../app/_typings.ts"/>

describe('Config', () => {
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

    describe('of app user', () => {
        it('should fetch currently logged in user', () => {
            var username = 'some_user';
            localStorageService.set(BitbucketNotifier.ConfigObject.USER, username);
            expect(config.getUsername()).toEqual(username);
        });

        it('should save logged in user', () => {
            var username = 'some_user';
            config.setUsername(username);
            expect(localStorageService.get(BitbucketNotifier.ConfigObject.USER)).toEqual(username);
        });
    });

    describe('of socket server', () => {
        it('should fetch an HTTP address to socket server', () => {
            var address = 'http://localhost:1234';
            localStorageService.set(BitbucketNotifier.ConfigObject.SOCKET_SERVER, address);
            expect(config.getSocketServerAddress()).toEqual(address);
        });

        it('should fetch a proper HTTP address even if does not start from \'http\'', () => {
            var address = 'localhost:1234';
            var expectedAddress = 'http://localhost:1234';

            localStorageService.set(BitbucketNotifier.ConfigObject.SOCKET_SERVER, address);
            expect(config.getSocketServerAddress()).toEqual(expectedAddress);
        });

        it('should set socket server address', () => {
            var address = 'localhost:1234';
            config.setSocketServerAddress(address);
            expect(localStorageService.get(BitbucketNotifier.ConfigObject.SOCKET_SERVER)).toEqual(address);
        });
    });

    describe('of pull request progress', () => {
        it('should get a pull request progress option', () => {
            var option = 'proportions';
            localStorageService.set(BitbucketNotifier.ConfigObject.PULLREQUEST_PROGRESS, option);
            expect(config.getPullRequestProgress()).toEqual(option);
        });

        it("should get 'proportions' options as default", () => {
            expect(config.getPullRequestProgress()).toEqual('proportions');
        });

        it('should set pull request progress option', () => {
            var option = 'percent';
            config.setPullRequestProgress(option);
            expect(localStorageService.get(BitbucketNotifier.ConfigObject.PULLREQUEST_PROGRESS)).toEqual(option);
        });
    });
});
