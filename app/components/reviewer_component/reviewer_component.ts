import componentTemplate from './reviewer_component.html';
import './reviewer_component.less';

export class ReviewerComponent implements ng.IComponentOptions {
    public bindings: any = {
        reviewer: '=r'
    };
    public template: string = componentTemplate;
}
