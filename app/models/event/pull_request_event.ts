import {User} from '../user';
import {PullRequest} from '../pull_request';

export class PullRequestEvent {
    public actor: User = new User();
    public sourceEvent: string = '';
    public pullRequests: PullRequest[] = [];
    public context: PullRequest = new PullRequest();
}
