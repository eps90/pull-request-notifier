///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    'use strict';

    export function Socket(socketFactory, config: Config): any {
        var socket = io.connect(config.getSocketServerAddress());
        return socketFactory({
            ioSocket: socket
        });
    }

    Socket.$inject = ['socketFactory', 'Config'];
}
