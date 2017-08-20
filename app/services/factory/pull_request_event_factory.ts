import {PullRequestEvent} from '../../models/event/pull_request_event';
import {UserFactory} from './user_factory';
import {PullRequestFactory} from './pull_request_factory';

export class PullRequestEventFactory {
    public static create(rawObject: any): PullRequestEvent {
        const event = new PullRequestEvent();
        if (rawObject.hasOwnProperty('actor')) {
            event.actor = UserFactory.create(rawObject.actor);
        }

        if (rawObject.hasOwnProperty('sourceEvent')) {
            event.sourceEvent = rawObject.sourceEvent;
        }

        if (rawObject.hasOwnProperty('pullRequests')) {
            event.pullRequests = [];
            for (const currentPr of rawObject.pullRequests) {
                event.pullRequests.push(PullRequestFactory.create(currentPr));
            }
        }

        if (rawObject.hasOwnProperty('context')) {
            event.context = PullRequestFactory.create(rawObject.context);
        }

        return event;
    }
}
