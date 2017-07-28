export class ReviewerComponent implements ng.IDirective {
    restrict: string = 'E';
    scope: any = {
        reviewer: '=r'
    };
    templateUrl: string = '../components/reviewer_component/reviewer_component.html';

    static factory(): ng.IDirectiveFactory {
        return () => new ReviewerComponent();
    }
}
