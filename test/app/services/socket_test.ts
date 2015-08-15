///<reference path="../../../app/_typings.ts"/>

describe('Socket', () => {
    beforeEach(module('bitbucketNotifier'));
    var socket, secondSocket;

    beforeEach(inject([
        'Socket',
        'Socket',
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
