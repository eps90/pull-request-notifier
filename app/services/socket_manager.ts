import {Config} from './config';
import * as io from 'socket.io-client';

export class SocketManager {
    public socket: any;
    public static $inject: string[] = ['socketFactory', 'Config'];

    private connection: SocketIOClient.Socket;

    constructor(private socketFactory, config: Config) {
        this.connection = io.connect(config.getSocketServerAddress());
        this.socket = socketFactory({
            ioSocket: this.connection
        });
    }
}
