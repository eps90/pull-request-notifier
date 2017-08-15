export class SectionTileController implements ng.IComponentController {
    icon: string;
    _icon: string;

    $onInit = () => {
        if (this.icon !== undefined) {
            const iconClass = 'fa-' + this.icon;
            this._icon  = 'fa ' + iconClass;
        }
    }
}
