///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    export class Socket {
        constructor(private socketFactory) {}

        static $inject = ['socketFactory'];

        factory() {
            // @todo Get host and port from config
            var socket = io.connect('http://localhost:8765');
            return this.socketFactory({
                ioSocket: socket
            });
        }
    }
}
