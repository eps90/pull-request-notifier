///<reference path="../../../app/_typings.ts"/>

describe('Factories', () => {
    describe('UserFactory', () => {
        it('should create User object from raw object', () => {
            var rawObject = {
                displayName: 'John Kowalsky',
                username: 'john.kowalsky'
            };

            var user: BitbucketNotifier.User = BitbucketNotifier.UserFactory.create(rawObject);
            expect(user.displayName).toEqual('John Kowalsky');
            expect(user.username).toEqual('john.kowalsky');
        });
    });

    describe('ProjectFactory', () => {
        it('should create Project object from raw object', () => {
            var rawObject = {
                name: 'Awesome project',
                fullName: 'team_name/repo_name'
            };

            var project = BitbucketNotifier.ProjectFactory.create(rawObject);
            expect(project.fullName).toEqual('team_name/repo_name');
            expect(project.name).toEqual('Awesome project');
        });
    });
});
