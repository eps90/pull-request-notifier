import componentTemplate from './user_vote_component.html';
import './user_vote_component.less';
import {UserVoteController} from './user_vote_controller';

export class UserVoteComponent implements ng.IComponentOptions {
    public bindings: any = {
        reviewers: '='
    };
    public template: string = componentTemplate;

    public controller = UserVoteController;
}
