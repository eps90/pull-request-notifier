import * as io from 'socket.io-client';
import {Config} from './config/config';
import {ConfigObject} from '../models/config_object';

export class SocketManager {
    public socket: any;
    public static $inject: string[] = ['socketFactory', 'config'];

    private connection: SocketIOClient.Socket;

    constructor(private socketFactory, config: Config) {
        this.connection = io.connect(config.getItem(ConfigObject.SOCKET_SERVER));
        this.socket = socketFactory({
            ioSocket: this.connection
        });
    }
}
