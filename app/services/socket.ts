///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    export function Socket(socketFactory, config: Config) {
        var socket = io.connect(config.getSocketServerAddress());
        return socketFactory({
            ioSocket: socket
        });
    }

    Socket.$inject = ['socketFactory', 'Config'];
}
