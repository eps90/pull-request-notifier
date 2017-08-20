import {Reviewer} from '../../models/reviewer';
import {UserFactory} from './user_factory';

export class ReviewerFactory {
    public static create(rawObject): Reviewer {
        const reviewer = new Reviewer();
        if (rawObject.hasOwnProperty('user')) {
            reviewer.user = UserFactory.create(rawObject.user);
        }

        if (rawObject.hasOwnProperty('approved')) {
            reviewer.approved = rawObject.approved;
        }

        return reviewer;
    }
}
