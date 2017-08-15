import {PullRequest} from "../../services/models";
import {IAugmentedJQuery} from "angular";

export class PullRequestController implements ng.IComponentController {
    static $inject: string[] = ['$state', '$element'];

    pullRequest: PullRequest;

    constructor(private state: angular.ui.IStateService, private $element: IAugmentedJQuery) {}

    $onInit = () => {
        this.$element.on('click', () => {
            const pullRequest: PullRequest = this.pullRequest;
            const repositoryName = pullRequest.targetRepository.slugify();
            this.state.go('pull_request', {
                repositoryName: repositoryName,
                pullRequestId: pullRequest.id
            });
        });
    }
}
