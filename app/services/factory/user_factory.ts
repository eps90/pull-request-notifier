import {User} from '../../models/user';

export class UserFactory {
    public static create(rawObject: any): User {
        const user = new User();
        if (rawObject.hasOwnProperty('username')) {
            user.username = rawObject.username;
        }
        if (rawObject.hasOwnProperty('displayName')) {
            user.displayName = rawObject.displayName;
        }

        return user;
    }
}
