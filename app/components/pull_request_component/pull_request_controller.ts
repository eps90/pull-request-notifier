import {PullRequest} from '../../services/models';
import {IAugmentedJQuery} from 'angular';

export class PullRequestController implements ng.IComponentController {
    public pullRequest: PullRequest;

    public static $inject: string[] = ['$state', '$element'];

    constructor(private state: angular.ui.IStateService, private $element: IAugmentedJQuery) {}

    public $onInit = () => {
        this.$element.on('click', () => {
            const pullRequest: PullRequest = this.pullRequest;
            const repositoryName = pullRequest.targetRepository.slugify();
            this.state.go('pull_request', {
                repositoryName,
                pullRequestId: pullRequest.id
            });
        });
    }
}
