import {ChromeExtensionEvent, PullRequest} from '../../services/models';

export class ReminderController implements ng.IComponentController {
    public size: string;
    public disabled: boolean;
    public pullRequest: PullRequest;

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
    }

    public isLarge(): boolean {
        return this.size.toLowerCase() === 'lg';
    }
}
