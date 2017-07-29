import {SocketManager} from "../../../app/services/socket_manager";
import {SocketClientEvent} from "../../../app/services/models";
import * as angular from 'angular';

describe('SocketManager', () => {
    beforeEach(angular.mock.module('bitbucketNotifier.background'));
    var socketManager: SocketManager,
        secondSocketManager: SocketClientEvent;

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
