///<reference path="../../../app/_typings.ts"/>

fdescribe('Config', () => {
    var config: BitbucketNotifier.Config,
        localStorageService: angular.local.storage.ILocalStorageService;

    beforeEach(module('bitbucketNotifier'));
    beforeEach(inject([
        'Config',
        'localStorageService',
        (c, l) => {
            config = c;
            localStorageService = l;
        }
    ]));

    beforeEach(() => {
        localStorageService.clearAll();
    });

    describe('of app user', () => {
        it('should fetch currently logged in user', () => {
            var username = 'some_user';
            localStorageService.set(BitbucketNotifier.ConfigObject.USER, username);
            expect(config.getUsername()).toEqual(username);
        });

        it('should save logged in user', () => {
            var username = 'some_user';
            config.setUsername(username);
            expect(localStorageService.get(BitbucketNotifier.ConfigObject.USER)).toEqual(username);
        });
    });

    describe('of socket server', () => {
        it('should fetch an HTTP address to socket server', () => {
            var address = 'http://localhost:1234';
            localStorageService.set(BitbucketNotifier.ConfigObject.SOCKET_SERVER, address);
            expect(config.getSocketServerAddress()).toEqual(address);
        });

        it('should fetch a proper HTTP address even if does not start from \'http\'', () => {
            var address = 'localhost:1234';
            var expectedAddress = 'http://localhost:1234';

            localStorageService.set(BitbucketNotifier.ConfigObject.SOCKET_SERVER, address);
            expect(config.getSocketServerAddress()).toEqual(expectedAddress);
        });

        it('should set socket server address', () => {
            var address = 'localhost:1234';
            config.setSocketServerAddress(address);
            expect(localStorageService.get(BitbucketNotifier.ConfigObject.SOCKET_SERVER)).toEqual(address);
        });
    });

    describe('of pull request progress', () => {
        it('should get a pull request progress option', () => {
            var option = BitbucketNotifier.PullRequestProgress.PROPORTIONS;
            localStorageService.set(BitbucketNotifier.ConfigObject.PULLREQUEST_PROGRESS, option);
            expect(config.getPullRequestProgress()).toEqual(option);
        });

        it("should get 'proportions' options as default", () => {
            expect(config.getPullRequestProgress()).toEqual(BitbucketNotifier.PullRequestProgress.PROPORTIONS);
        });

        it('should set pull request progress option', () => {
            var option = BitbucketNotifier.PullRequestProgress.PERCENT;
            config.setPullRequestProgress(option);
            expect(localStorageService.get(BitbucketNotifier.ConfigObject.PULLREQUEST_PROGRESS)).toEqual(option);
        });
    });

    describe('of sounds', () => {
        it('should set sound path to new pull request notification', () => {
            var soundPath = 'path/to/sound.ogg';
            config.setNewPullRequestSound(soundPath);
            expect(localStorageService.get(BitbucketNotifier.Sound.NEW_PULLREQUEST)).toEqual(soundPath);
        });

        it('should set sound path to approved pull request notification', () => {
            var soundPath = 'path/to/sound.ogg';
            config.setApprovedPullRequestSound(soundPath);
            expect(localStorageService.get(BitbucketNotifier.Sound.APPROVED_PULLREQUEST)).toEqual(soundPath);
        });

        it('should set sound path to merged pull request notification', () => {
            var soundPath = 'path/to/sound.ogg';
            config.setMergedPullRequestSound(soundPath);
            expect(localStorageService.get(BitbucketNotifier.Sound.MERGED_PULLREQUEST)).toEqual(soundPath);
        });

        it('should set sound path to reminder notification', () => {
            var soundPath = 'path/to/sound.ogg';
            config.setReminderSound(soundPath);
            expect(localStorageService.get(BitbucketNotifier.Sound.REMINDER)).toEqual(soundPath);
        });

        it('should get sound path to new pull request notification', () => {
            var soundPath = 'path/to/sound.ogg';
            localStorageService.set(BitbucketNotifier.Sound.NEW_PULLREQUEST, soundPath);
            expect(config.getNewPullRequestSound()).toEqual(soundPath);
        });

        it('should get sound path to approved pull request notification', () => {
            var soundPath = 'path/to/sound.ogg';
            localStorageService.set(BitbucketNotifier.Sound.APPROVED_PULLREQUEST, soundPath);
            expect(config.getApprovedPullRequestSound()).toEqual(soundPath);
        });

        it('should get sound path to merged pull request notification', () => {
            var soundPath = 'path/to/sound.ogg';
            localStorageService.set(BitbucketNotifier.Sound.MERGED_PULLREQUEST, soundPath);
            expect(config.getMergedPullRequestSound()).toEqual(soundPath);
        });

        it('should get sound path to reminder notification', () => {
            var soundPath = 'path/to/sound.ogg';
            localStorageService.set(BitbucketNotifier.Sound.REMINDER, soundPath);
            expect(config.getReminderSound()).toEqual(soundPath);
        });
    });
});
