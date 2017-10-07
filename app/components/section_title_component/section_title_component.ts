import componentTemplate from './section_title_component.html';
import './section_title_component.less';
import {SectionTileController} from './section_tile_controller';

export class SectionTitleComponent implements ng.IComponentOptions {
    public template: string = componentTemplate;
    public bindings: any = {
        icon: '@'
    };
    public transclude: boolean = true;

    public controller = SectionTileController;
}
