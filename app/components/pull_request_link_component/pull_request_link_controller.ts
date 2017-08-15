import {PullRequest} from "../../services/models";

export class PullRequestLinkController implements ng.IComponentController {
    pr: PullRequest;
    size: string;

    $onInit = () => {
        this.size = this.size || 'sm';
    };

    isLarge(): boolean {
        return this.size.toLowerCase() === 'lg';
    }

    goToPullRequest($event): void {
        $event.stopPropagation();
        if ($event.which === 1) {
            window['chrome'].tabs.create({
                url: this.pr.links.html
            });
        }
    }
}
