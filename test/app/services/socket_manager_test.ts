///<reference path="../../../app/_typings.ts"/>

describe('SocketManager', () => {
    beforeEach(module('bitbucketNotifier.background'));
    var socketManager: BitbucketNotifier.SocketManager,
        secondSocketManager: BitbucketNotifier.SocketClientEvent;

    beforeEach(inject([
        'SocketManager',
        'SocketManager',
        (s, s2) => {
            socketManager = s;
            secondSocketManager = s2;
        }
    ]));

    it('should return socket object', () => {
        expect(typeof socketManager.socket.on === 'function').toBeTruthy();
        expect(typeof socketManager.socket.emit === 'function').toBeTruthy();
    });

    it('should always return the same instance of socket', () => {
        expect(socketManager === secondSocketManager).toBeTruthy();
    });
});
