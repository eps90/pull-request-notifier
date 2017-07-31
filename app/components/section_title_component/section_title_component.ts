import componentTemplate from './section_title_component.html';
import './section_title_component.less';

export class SectionTitleComponent implements ng.IDirective {
    restrict: string = 'E';
    template: string = componentTemplate;
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
