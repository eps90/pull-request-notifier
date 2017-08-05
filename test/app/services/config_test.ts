import {Config} from "../../../app/services/config";
import {SoundRepository} from "../../../app/services/sound_repository";
import {ConfigObject, PullRequestProgress, NotificationSound} from "../../../app/services/models";
import * as angular from 'angular';

describe('Config', () => {
    var config: Config,
        localStorageService: angular.local.storage.ILocalStorageService,
        soundRepository: SoundRepository;

    beforeEach(angular.mock.module('bitbucketNotifier'));
    beforeEach(inject([
        'Config',
        'localStorageService',
        'SoundRepository',
        (c, l, sr) => {
            config = c;
            localStorageService = l;
            soundRepository = sr;
        }
    ]));

    beforeEach(() => {
        localStorageService.clearAll();
    });

    describe('of app user', () => {
        it('should fetch currently logged in user', () => {
            var username = 'some_user';
            localStorageService.set(ConfigObject.USER, username);
            expect(config.getUsername()).toEqual(username);
        });

        it('should save logged in user', () => {
            var username = 'some_user';
            config.setUsername(username);
            expect(localStorageService.get(ConfigObject.USER)).toEqual(username);
        });
    });

    describe('of socket server', () => {
        it('should fetch an HTTP address to socket server', () => {
            var address = 'http://localhost:1234';
            localStorageService.set(ConfigObject.SOCKET_SERVER, address);
            expect(config.getSocketServerAddress()).toEqual(address);
        });

        it('should fetch a proper HTTP address even if does not start from \'http\'', () => {
            var address = 'localhost:1234';
            var expectedAddress = 'http://localhost:1234';

            localStorageService.set(ConfigObject.SOCKET_SERVER, address);
            expect(config.getSocketServerAddress()).toEqual(expectedAddress);
        });

        it('should set socket server address', () => {
            var address = 'localhost:1234';
            config.setSocketServerAddress(address);
            expect(localStorageService.get(ConfigObject.SOCKET_SERVER)).toEqual(address);
        });
    });

    describe('of pull request progress', () => {
        it('should get a pull request progress option', () => {
            var option = PullRequestProgress.PROPORTIONS;
            localStorageService.set(ConfigObject.PULLREQUEST_PROGRESS, option);
            expect(config.getPullRequestProgress()).toEqual(option);
        });

        it("should get 'proportions' options as default", () => {
            expect(config.getPullRequestProgress()).toEqual(PullRequestProgress.PROPORTIONS);
        });

        it('should set pull request progress option', () => {
            var option = PullRequestProgress.PERCENT;
            config.setPullRequestProgress(option);
            expect(localStorageService.get(ConfigObject.PULLREQUEST_PROGRESS)).toEqual(option);
        });
    });

    describe('of sounds', () => {
        it('should set sound path to new pull request notification', () => {
            testSoundSetter('setNewPullRequestSound', NotificationSound.NEW_PULLREQUEST);
        });

        it('should set sound path to approved pull request notification', () => {
            testSoundSetter('setApprovedPullRequestSound', NotificationSound.APPROVED_PULLREQUEST);
        });

        it('should set sound path to merged pull request notification', () => {
            testSoundSetter('setMergedPullRequestSound', NotificationSound.MERGED_PULLREQUEST);
        });

        it('should set sound path to reminder notification', () => {
            testSoundSetter('setReminderSound', NotificationSound.REMINDER);
        });

        function testSoundSetter(setterName, soundKey): void {
            var soundPath = 'path/to/sound_' + soundKey + '.ogg';
            config[setterName](soundPath);
            expect(localStorageService.get(soundKey)).toEqual(soundPath);
        }

        it('should get sound path to new pull request notification', () => {
            testSoundGetter('getNewPullRequestSound', NotificationSound.NEW_PULLREQUEST);
        });

        it('should get sound path to approved pull request notification', () => {
            testSoundGetter('getApprovedPullRequestSound', NotificationSound.APPROVED_PULLREQUEST);
        });

        it('should get sound path to merged pull request notification', () => {
            testSoundGetter('getMergedPullRequestSound', NotificationSound.MERGED_PULLREQUEST);
        });

        it('should get sound path to reminder notification', () => {
            testSoundGetter('getReminderSound', NotificationSound.REMINDER);
        });

        function testSoundGetter(getterName, soundKey): void {
            var soundPath = 'path/to/sound' + soundKey + '.ogg';
            localStorageService.set(soundKey, soundPath);
            expect(config[getterName]()).toEqual(soundPath);
        }

        describe('with default values', () => {
            it('should return default sound for new pull request', () => {
                expect(config.getNewPullRequestSound()).toEqual(soundRepository.findById('bell').soundPath);
            });
            it('should return default sound for approved pull request', () => {
                expect(config.getApprovedPullRequestSound()).toEqual(soundRepository.findById('ring').soundPath);
            });

            it('should return default sound for merged pull request', () => {
                expect(config.getMergedPullRequestSound()).toEqual(soundRepository.findById('ring').soundPath);
            });

            it('should return default sound for reminder', () => {
                expect(config.getReminderSound()).toEqual(soundRepository.findById('alarm').soundPath);
            });
        });
    });
});
