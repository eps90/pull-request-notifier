///<reference path="../../../app/_typings.ts"/>

describe('SocketManager', () => {
    beforeEach(module('bitbucketNotifier.background'));
    var socket, secondSocket;

    beforeEach(inject([
        'SocketManager',
        'SocketManager',
        (s, s2) => {
            socket = s;
            secondSocket = s2;
        }
    ]));

    it('should return socket object', () => {
        expect(typeof socket.on === 'function').toBeTruthy();
        expect(typeof socket.emit === 'function').toBeTruthy();
    });

    it('should always return the same instance of socket', () => {
        expect(socket === secondSocket).toBeTruthy();
    });
});
