import componentTemplate from './reviewer_component.html';
import './reviewer_component.less';

export class ReviewerComponent implements ng.IComponentOptions {
    bindings: any = {
        reviewer: '=r'
    };
    template: string = componentTemplate;
}
