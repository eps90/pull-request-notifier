import componentTemplate from './options_component.html';
import {OptionsController} from './options_controller';

export class OptionsComponent implements ng.IComponentOptions {
    public template: string = componentTemplate;
    public controller = OptionsController;
}
