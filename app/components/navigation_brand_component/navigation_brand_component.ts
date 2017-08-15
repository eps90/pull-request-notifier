import componentTemplate from './navigation_brand_component.html';

export class NavigationBrandComponent implements ng.IComponentOptions{
    template: string = componentTemplate;
    bindings: any = {
        content: '@',
        icon: '@'
    };
}
