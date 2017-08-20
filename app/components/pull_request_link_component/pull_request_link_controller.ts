import {PullRequest} from '../../models/pull_request';

export class PullRequestLinkController implements ng.IComponentController {
    public pr: PullRequest;
    public size: string;

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
        }
    }
}
