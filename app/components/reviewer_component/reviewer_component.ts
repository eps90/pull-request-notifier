import componentTemplate from './reviewer_component.html';
import './reviewer_component.less';

export class ReviewerComponent implements ng.IDirective {
    restrict: string = 'E';
    scope: any = {
        reviewer: '=r'
    };
    template: string = componentTemplate;

    static factory(): ng.IDirectiveFactory {
        return () => new ReviewerComponent();
    }
}
