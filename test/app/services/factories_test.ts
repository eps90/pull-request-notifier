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
});
