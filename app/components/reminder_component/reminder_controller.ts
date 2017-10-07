import {PullRequest} from '../../models/pull_request';
import {ChromeExtensionEvent} from '../../models/event/chrome_extension_event';
import {AnalyticsEventDispatcher} from '../../services/analytics_event_dispatcher';
import {ReminderSentEvent} from '../../models/analytics_event/reminder_sent_event';

export class ReminderController implements ng.IComponentController {
    public size: string;
    public disabled: boolean;
    public pullRequest: PullRequest;

    public static $inject: string[] = ['AnalyticsEventDispatcher'];

    constructor(private analyticsEventDispatcher: AnalyticsEventDispatcher) {}

    public $onInit = () => {
        this.size = this.size || 'sm';
        this.disabled = false;
    }

    public remind($event: ng.IAngularEvent): void {
        $event.stopPropagation();
        this.disabled = true;
        window['chrome'].extension.sendMessage(
            new ChromeExtensionEvent(
                ChromeExtensionEvent.REMIND,
                this.pullRequest
            )
        );
        this.analyticsEventDispatcher.dispatch(
            this.isLarge()
                ? ReminderSentEvent.fromPullRequestPreview()
                : ReminderSentEvent.fromPullRequestPreview()
        );
    }

    public isLarge(): boolean {
        return this.size.toLowerCase() === 'lg';
    }
}
