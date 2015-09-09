///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    export class UserFactory {
        static create(rawObject: any): User {
            var user = new User();
            if (rawObject.hasOwnProperty('username')) {
                user.username = rawObject.username;
            }
            if (rawObject.hasOwnProperty('displayName')) {
                user.displayName = rawObject.displayName;
            }

            return user;
        }
    }
}
