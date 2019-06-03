import {Config} from '../../../app/services/config';
import {SoundRepository} from '../../../app/services/sound_repository';
import * as angular from 'angular';
import {ConfigObject} from '../../../app/models/config_object';
import {PullRequestProgress} from '../../../app/models/pull_request_progress';
import {NotificationSound} from '../../../app/models/notification_sound';

describe('Config', () => {
    let config: Config;
    let localStorageService: angular.local.storage.ILocalStorageService;
    let soundRepository: SoundRepository;

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
            const userUuid = 'some_user';
            localStorageService.set(ConfigObject.USER, userUuid);
            expect(config.getUserUuid()).toEqual(userUuid);
        });

        it('should save logged in user', () => {
            const userUuid = 'some_user';
            config.setUserUuid(userUuid);
            expect(localStorageService.get(ConfigObject.USER)).toEqual(userUuid);
        });
    });

    describe('of socket server', () => {
        it('should fetch an HTTP address to socket server', () => {
            const address = 'http://localhost:1234';
            localStorageService.set(ConfigObject.SOCKET_SERVER, address);
            expect(config.getSocketServerAddress()).toEqual(address);
        });

        it('should fetch a proper HTTP address even if does not start from \'http\'', () => {
            const address = 'localhost:1234';
            const expectedAddress = 'http://localhost:1234';

            localStorageService.set(ConfigObject.SOCKET_SERVER, address);
            expect(config.getSocketServerAddress()).toEqual(expectedAddress);
        });

        it('should set socket server address', () => {
            const address = 'localhost:1234';
            config.setSocketServerAddress(address);
            expect(localStorageService.get(ConfigObject.SOCKET_SERVER)).toEqual(address);
        });
    });

    describe('of pull request progress', () => {
        it('should get a pull request progress option', () => {
            const option = PullRequestProgress.PROPORTIONS;
            localStorageService.set(ConfigObject.PULLREQUEST_PROGRESS, option);
            expect(config.getPullRequestProgress()).toEqual(option);
        });

        it("should get 'proportions' options as default", () => {
            expect(config.getPullRequestProgress()).toEqual(PullRequestProgress.PROPORTIONS);
        });

        it('should set pull request progress option', () => {
            const option = PullRequestProgress.PERCENT;
            config.setPullRequestProgress(option);
            expect(localStorageService.get(ConfigObject.PULLREQUEST_PROGRESS)).toEqual(option);
        });
    });

    describe('of sounds', () => {
        it('should set a sound for new pull request notification', () => {
            testSoundSetter('setNewPullRequestSound', NotificationSound.NEW_PULLREQUEST);
        });

        it('should set a sound for approved pull request notification', () => {
            testSoundSetter('setApprovedPullRequestSound', NotificationSound.APPROVED_PULLREQUEST);
        });

        it('should set a sound for merged pull request notification', () => {
            testSoundSetter('setMergedPullRequestSound', NotificationSound.MERGED_PULLREQUEST);
        });

        it('should set a sound for reminder notification', () => {
            testSoundSetter('setReminderSound', NotificationSound.REMINDER);
        });

        function testSoundSetter(setterName, soundKey): void {
            const soundId = 'path/to/sound_' + soundKey + '.ogg';
            config[setterName](soundId);
            expect(localStorageService.get(soundKey)).toEqual(soundId);
        }

        it('should get sound id for new pull request notification', () => {
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
            const soundId = 'path/to/sound' + soundKey + '.ogg';
            localStorageService.set(soundKey, soundId);
            expect(config[getterName]()).toEqual(soundId);
        }

        describe('with default values', () => {
            it('should return default sound for new pull request', () => {
                expect(config.getNewPullRequestSound()).toEqual(soundRepository.findById('bell').id);
            });
            it('should return default sound for approved pull request', () => {
                expect(config.getApprovedPullRequestSound()).toEqual(soundRepository.findById('ring').id);
            });

            it('should return default sound for merged pull request', () => {
                expect(config.getMergedPullRequestSound()).toEqual(soundRepository.findById('ring').id);
            });

            it('should return default sound for reminder', () => {
                expect(config.getReminderSound()).toEqual(soundRepository.findById('alarm').id);
            });
        });
    });
});
