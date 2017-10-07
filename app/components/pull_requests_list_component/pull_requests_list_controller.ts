import {PullRequestRepository} from '../../services/pull_request_repository';
import {PullRequest} from '../../models/pull_request';
import {TabSwitchEvent} from '../../models/analytics_event/tab_switch_event';
import {AnalyticsEventDispatcher} from '../../services/analytics_event_dispatcher';

export class PullRequestsListController implements ng.IComponentController {
    public pullRequests: PullRequest[];

    public static $inject: string[] = ['PullRequestRepository', 'AnalyticsEventDispatcher', '$scope'];

    private currentlyChosenTab: string;

    constructor(
        private pullRequestRepository: PullRequestRepository,
        private analyticsEventDispatcher: AnalyticsEventDispatcher,
        private $scope: ng.IScope
    ) {}

    public $onInit = () => {
        this.pullRequests = this.pullRequestRepository.pullRequests;

        this.$scope.$watch(
            () => {
                return this.pullRequestRepository.pullRequests;
            },
            (newValue, oldValue) => {
                if (newValue !== oldValue) {
                    this.pullRequests = newValue;
                }
            },
            true
        );
    }

    public onSelect(tabName: string): void {
        if (this.currentlyChosenTab === undefined) {
            // Initial tab select
            this.currentlyChosenTab = tabName;
            return;
        } else if (tabName === this.currentlyChosenTab) {
            return;
        }

        this.currentlyChosenTab = tabName;
        let analyticsEvent: TabSwitchEvent;
        switch (tabName) {
            case 'AUTHORED':
                analyticsEvent = TabSwitchEvent.authoredPullRequestsTab();
                break;
            case 'ASSIGNED':
                analyticsEvent = TabSwitchEvent.assignedPullRequestsTab();
                break;
            default:
                break;
        }
        this.analyticsEventDispatcher.dispatch(analyticsEvent);
    }
}
