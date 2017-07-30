import {PullRequestRepository} from "../../services/pull_request_repository";
import componentTemplate from './pull_requests_list_component.html';

export class PullRequestsListComponent implements ng.IDirective {
    restrict: string = 'E';
    template: string = componentTemplate;

    constructor(private pullRequestRepository: PullRequestRepository) {}

    link: ng.IDirectiveLinkFn = (scope: ng.IScope) => {
        scope['pullRequests'] = this.pullRequestRepository.pullRequests;

        scope.$watch(
            () => {
                return this.pullRequestRepository.pullRequests;
            },
            (newValue, oldValue) => {
                if (newValue !== oldValue) {
                    scope['pullRequests'] = newValue;
                }
            },
            true
        );
    };

    static factory(): ng.IDirectiveFactory {
        var component = (pullRequestRepository) => new PullRequestsListComponent(pullRequestRepository);
        component.$inject = ['PullRequestRepository'];
        return component;
    }
}
