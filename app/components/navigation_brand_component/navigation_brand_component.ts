import componentTemplate from './navigation_brand_component.html';

export class NavigationBrandComponent {
    restrict: string = 'E';
    template: string = componentTemplate;
    scope: any = {
        content: '@',
        icon: '@'
    };

    static factory(): ng.IDirectiveFactory {
        return () => new NavigationBrandComponent();
    }
}
