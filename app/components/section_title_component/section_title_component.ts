import componentTemplate from './section_title_component.html';
import './section_title_component.less';
import {SectionTileController} from "./section_tile_controller";

export class SectionTitleComponent implements ng.IComponentOptions {
    template: string = componentTemplate;
    bindings: any = {
        icon: '@'
    };
    transclude: boolean = true;

    controller = SectionTileController;
}
