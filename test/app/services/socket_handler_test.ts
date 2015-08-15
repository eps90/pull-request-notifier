///<reference path="../../../app/_typings.ts"/>

describe('SocketHandler', () => {
    var socketHandler,
        socket,
        localStorageService: angular.local.storage.ILocalStorageService;

    beforeEach(module('bitbucketNotifier'));
    beforeEach(inject([
        'SocketHandler',
        'Socket',
        'localStorageService',
        (sh, s, l) => {
            socketHandler = sh;
            socket = s;
            localStorageService = l;
        }
    ]));
    beforeEach(() => {
        localStorageService.set('app:user', 'john.smith');
    });

    it('should emit client:introduce event with logged in user, on connection', () => {
        socket.receive('connect');
        expect(socket.emits).toEqual(jasmine.objectContaining({'client:introduce': jasmine.anything()}));
        expect(socket.emits['client:introduce'][0]).toEqual(['john.smith']);
    });
});
