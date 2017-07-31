import componentTemplate from './pull_requests_header_component.html';
import './pull_requests_header_component.less';

export class PullRequestsHeaderComponent implements ng.IDirective {
    restrict: string =  'E';
    template: string = componentTemplate;
    scope: any = {
        mode: '@'
    };

    static factory(): ng.IDirectiveFactory {
        return () => new PullRequestsHeaderComponent();
    }
}
