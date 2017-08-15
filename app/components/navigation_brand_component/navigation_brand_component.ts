import componentTemplate from './navigation_brand_component.html';

export class NavigationBrandComponent implements ng.IComponentOptions {
    public template: string = componentTemplate;
    public bindings: any = {
        content: '@',
        icon: '@'
    };
}
