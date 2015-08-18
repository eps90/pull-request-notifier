///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    export function Socket(socketFactory) {
        this.$inject = ['socketFactory'];
        // @todo Get host and port from config
        var socket = io.connect('http://localhost:8765');
        return socketFactory({
            ioSocket: socket
        });
    }
}
