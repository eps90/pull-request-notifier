import {SocketHandler} from '../../services/socket_handler';
import {Indicator} from '../../services/indicator';

export class BackgroundComponent implements ng.IDirective {
    public restrict: string = 'A';

    constructor(private socketHandler: SocketHandler, private indicator: Indicator) {}

    public static factory(): ng.IDirectiveFactory {
        const component = (socketHandler, indicator) => new BackgroundComponent(socketHandler, indicator);
        component.$inject = ['SocketHandler', 'Indicator'];
        return component;
    }
}
