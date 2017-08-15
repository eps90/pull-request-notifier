export class SectionTileController implements ng.IComponentController {
    public icon: string;
    public _icon: string;

    public $onInit = () => {
        if (this.icon !== undefined) {
            const iconClass = 'fa-' + this.icon;
            this._icon  = 'fa ' + iconClass;
        }
    }
}
