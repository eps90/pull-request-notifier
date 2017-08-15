import {ChromeExtensionEvent, PullRequest} from "../../services/models";

export class ReminderController implements ng.IComponentController {
    size: string;
    disabled: boolean;
    pullRequest: PullRequest;

    $onInit = () => {
        this.size = this.size || 'sm';
        this.disabled = false;
    };

    remind($event: ng.IAngularEvent): void {
        $event.stopPropagation();
        this.disabled = true;
        window['chrome'].extension.sendMessage(
            new ChromeExtensionEvent(
                ChromeExtensionEvent.REMIND,
                this.pullRequest
            )
        );
    }

    isLarge(): boolean {
        return this.size.toLowerCase() === 'lg';
    }
}
