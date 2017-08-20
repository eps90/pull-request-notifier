import {PullRequestLinks} from '../../models/pull_request_links';

export class PullRequestLinksFactory {
    public static create(rawObject: any): PullRequestLinks {
        const links = new PullRequestLinks();

        if (rawObject.hasOwnProperty('self')) {
            links.self = rawObject.self;
        }

        if (rawObject.hasOwnProperty('html')) {
            links.html = rawObject.html;
        }

        return links;
    }
}
