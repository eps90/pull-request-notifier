export class SectionTitleComponent implements ng.IDirective {
    restrict: string = 'E';
    templateUrl: string = '../components/section_title_component/section_title_component.html';
    scope: any = {
        icon: '@'
    };
    transclude: boolean = true;

    link: ng.IDirectiveLinkFn = (scope: ng.IScope) => {
        if (scope['icon'] !== undefined) {
            var iconClass = 'fa-' + scope['icon'];
            scope['_icon'] = 'fa ' + iconClass;
        }
    };

    static factory(): ng.IDirectiveFactory {
        return () => new SectionTitleComponent();
    }
}
