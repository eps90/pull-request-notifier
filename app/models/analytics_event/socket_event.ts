import {ExtendedAnalyticsEventInterface} from './extended_analytics_event';

export class SocketEvent implements ExtendedAnalyticsEventInterface {
    public static SOCKET_CONNECTED = 'connected';
    public static SOCKET_DISCONNECTED = 'disconnected';

    private constructor(private action: string, private serverVersion: string = '') {
        if (action !== SocketEvent.SOCKET_CONNECTED && action !== SocketEvent.SOCKET_DISCONNECTED) {
            throw Error('Invalid action');
        }
    }

    public static connected(serverVersion: string = ''): SocketEvent {
        return new this(SocketEvent.SOCKET_CONNECTED, serverVersion);
    }

    public static disconnected(serverVersion: string = ''): SocketEvent {
        return new this(SocketEvent.SOCKET_DISCONNECTED, serverVersion);
    }

    public getCategory(): string {
        return 'Server';
    }

    public getAction(): string {
        return this.action;
    }

    public getLabel(): string {
        return this.serverVersion;
    }

    public getValue(): number {
        return undefined;
    }

    public getDimensions(): { [p: string]: any } {
        return undefined;
    }

    public isNonInteractive(): boolean {
        return true;
    }
}
