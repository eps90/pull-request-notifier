import {PullRequest} from '../../models/pull_request';
import {AnalyticsEventDispatcher} from '../../services/analytics_event_dispatcher';
import {PullRequestOpenedEvent} from '../../models/analytics_event/pull_request_opened_event';

export class PullRequestLinkController implements ng.IComponentController {
    public pr: PullRequest;
    public size: string;

    public static $inject: string[] = ['AnalyticsEventDispatcher'];

    constructor(private analyticsEventDispatcher: AnalyticsEventDispatcher) {}

    public $onInit = () => {
        this.size = this.size || 'sm';
    }

    public isLarge(): boolean {
        return this.size.toLowerCase() === 'lg';
    }

    public goToPullRequest($event): void {
        $event.stopPropagation();
        if ($event.which === 1) {
            window['chrome'].tabs.create({
                url: this.pr.links.html
            });
            this.analyticsEventDispatcher.dispatch(
                this.isLarge()
                    ? PullRequestOpenedEvent.fromPullRequestPreview()
                    : PullRequestOpenedEvent.fromPullRequestList()
            );
        }
    }
}
