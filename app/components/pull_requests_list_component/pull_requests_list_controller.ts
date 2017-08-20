import {PullRequestRepository} from '../../services/pull_request_repository';
import {PullRequest} from '../../models/pull_request';

export class PullRequestsListController implements ng.IComponentController {
    public pullRequests: PullRequest[];

    public static $inject: string[] = ['PullRequestRepository'];

    constructor(private pullRequestRepository: PullRequestRepository) {}

    public $onInit = () => {
        this.pullRequests = this.pullRequestRepository.pullRequests;
        //
        // scope.$watch(
        //     () => {
        //         return this.pullRequestRepository.pullRequests;
        //     },
        //     (newValue, oldValue) => {
        //         if (newValue !== oldValue) {
        //             scope['pullRequests'] = newValue;
        //         }
        //     },
        //     true
        // );
    }
}
