import {User} from '../../models/user';

export class UserFactory {
    public static create(rawObject: any): User {
        const user = new User();
        if (rawObject.hasOwnProperty('uuid')) {
            user.uuid = rawObject.uuid;
        }
        if (rawObject.hasOwnProperty('displayName')) {
            user.displayName = rawObject.displayName;
        }

        return user;
    }
}
