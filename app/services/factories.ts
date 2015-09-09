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

    export class ProjectFactory {
        static create(rawObject: any): Project {
            var project = new Project();
            if (rawObject.hasOwnProperty('name')) {
                project.name = rawObject.name;
            }
            if (rawObject.hasOwnProperty('fullName')) {
                project.fullName = rawObject.fullName;
            }

            return project;
        }
    }
}
