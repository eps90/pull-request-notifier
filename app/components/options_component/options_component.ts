import componentTemplate from './options_component.html';
import {OptionsController} from "./options_controller";

export class OptionsComponent implements ng.IComponentOptions {
    restrict: string =  'E';
    template: string = componentTemplate;
    controller = OptionsController;
}
