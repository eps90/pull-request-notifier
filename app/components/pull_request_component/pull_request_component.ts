import {PullRequest} from "../../services/models";
import componentTemplate from './pull_request_component.html';
import './pull_request_component.less';

export class PullRequestComponent implements ng.IDirective {
    restrict: string = 'E';
    template: string = componentTemplate;
    scope: any = {
        pullRequest: '=pr',
        mode: '@'
    };

    constructor(private state: angular.ui.IStateService) {}

    link: ng.IDirectiveLinkFn = (scope: ng.IScope, element: ng.IAugmentedJQuery) => {
        element.on('click', () => {
            var pullRequest: PullRequest = scope['pullRequest'];
            var repositoryName = pullRequest.targetRepository.slugify();
            this.state.go('pull_request', {
                repositoryName: repositoryName,
                pullRequestId: pullRequest.id
            });
        });
    };

    static factory(): ng.IDirectiveFactory {
        var component = (state) => new PullRequestComponent(state);
        component.$inject = ['$state'];
        return component;
    }
}
