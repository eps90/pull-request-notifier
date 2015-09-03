///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    'use strict';

    export function SocketManager(socketFactory, config: Config): any {
        var socket = io.connect(config.getSocketServerAddress());
        return socketFactory({
            ioSocket: socket
        });
    }

    SocketManager.$inject = ['socketFactory', 'Config'];
}
