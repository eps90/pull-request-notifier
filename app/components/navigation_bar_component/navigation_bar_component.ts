import componentTemplate from './navigation_bar_component.html';
import './navigation_bar_component.less';
import {NavigationBarController} from "./navigation_bar_controller";

export class NavigationBarComponent implements ng.IComponentOptions {
    template: string = componentTemplate;
    controller = NavigationBarController;
}
