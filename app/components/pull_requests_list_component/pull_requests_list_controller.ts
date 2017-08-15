import {PullRequestRepository} from "../../services/pull_request_repository";
import {PullRequest} from "../../services/models";

export class PullRequestsListController implements ng.IComponentController {
    static $inject: string[] = ['PullRequestRepository'];

    pullRequests: PullRequest[];

    constructor(private pullRequestRepository: PullRequestRepository) {}

    $onInit = () => {
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
    };
}
