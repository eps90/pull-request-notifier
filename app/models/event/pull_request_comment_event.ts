import {User} from '../user';
import {PullRequest} from '../pull_request';
import {Comment} from '../comment';

export class PullRequestCommentEvent {
    public actor: User = new User();
    public pullRequest: PullRequest = new PullRequest();
    public comment: Comment = new Comment();
}
