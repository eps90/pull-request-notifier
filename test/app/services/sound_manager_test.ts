import {SoundManager} from '../../../app/services/sound_manager';
import {Config} from '../../../app/services/config';
import {SoundRepository} from '../../../app/services/sound_repository';
import * as angular from 'angular';
import {NotificationSound} from '../../../app/models/notification_sound';
import {Sound} from '../../../app/models/sound';
import {HowlSoundFactory} from '../../../app/services/factory/howl_sound_factory';
import {DoNotDisturbService} from '../../../app/services/do_not_disturb_service';

describe('SoundManager', () => {
    let soundManager: SoundManager;
    let soundRepository: SoundRepository;
    let config: Config;
    let dndService: DoNotDisturbService;
    let sounds;
    let isDndOn: boolean;

    beforeEach(() => {
        sounds = {};
        const counter = 0;
        spyOn(HowlSoundFactory, 'createSound').and.callFake((soundPath) => {
            sounds[soundPath] = jasmine.createSpyObj(`Howl#${counter}`, ['play']);
            return sounds[soundPath];
        });
        isDndOn = false;
    });
    beforeEach(angular.mock.module('bitbucketNotifier.background'));
    beforeEach(angular.mock.module([
        '$provide',
        ($provide: ng.auto.IProvideService) => {
            $provide.value('Config', {
                getNewPullRequestSound: jasmine.createSpy('Config.getNewPullRequest').and.callFake(() => {
                    return getFakeSoundId(NotificationSound.NEW_PULLREQUEST);
                }),
                getApprovedPullRequestSound: jasmine.createSpy('Config.getApprovedPullRequest').and.callFake(() => {
                    return getFakeSoundId(NotificationSound.APPROVED_PULLREQUEST);
                }),
                getMergedPullRequestSound: jasmine.createSpy('Config.getMergedPullRequest').and.callFake(() => {
                    return getFakeSoundId(NotificationSound.MERGED_PULLREQUEST);
                }),
                getReminderSound: jasmine.createSpy('Config.getReminder').and.callFake(() => {
                    return getFakeSoundId(NotificationSound.REMINDER);
                })
            });

            $provide.value('SoundRepository', {
                findById: jasmine.createSpy('SoundRepository.findById').and.callFake((soundId: string) => {
                    return new Sound(soundId, getFakeSoundPath(soundId), 'Fake label');
                })
            });
            $provide.value('DndService', {
                isDndOn: jasmine.createSpy('DndService.isDndOn').and.callFake(() => isDndOn)
            });
        }
    ]));
    beforeEach(inject([
        'SoundManager',
        'Config',
        'SoundRepository',
        'DndService',
        (sm, c, sr, dnd) => {
            soundManager = sm;
            config = c;
            soundRepository = sr;
            dndService = dnd;
        }
    ]));

    it('it should register sounds from config on startup', () => {
        let calls = 0;
        function testSoundRegistration(soundKey): void {
            expect((HowlSoundFactory.createSound as jasmine.Spy).calls.argsFor(calls++))
                .toEqual(['sound__' + soundKey + '.mp3']);
        }

        /* tslint:disable */
        new SoundManager(config, soundRepository, dndService);
        /* tslint:enable */

        testSoundRegistration(NotificationSound.NEW_PULLREQUEST);
        testSoundRegistration(NotificationSound.APPROVED_PULLREQUEST);
        testSoundRegistration(NotificationSound.MERGED_PULLREQUEST);
        testSoundRegistration(NotificationSound.REMINDER);
    });

    describe('Sound playing', () => {
        it('should be able to play a new pull request sound', () => {
            soundManager.playNewPullRequestSound();
            assertExpectedSoundCalled(NotificationSound.NEW_PULLREQUEST);
        });

        it('should be able to play an approved pull request sound', () => {
            soundManager.playApprovedPullRequestSound();
            assertExpectedSoundCalled(NotificationSound.APPROVED_PULLREQUEST);
        });

        it('should be able to play a merged pull request sound', () => {
            soundManager.playMergedPullRequestSound();
            assertExpectedSoundCalled(NotificationSound.MERGED_PULLREQUEST);
        });

        it('should be able to play a reminder sound', () => {
            soundManager.playReminderSound();
            assertExpectedSoundCalled(NotificationSound.REMINDER);
        });

        function assertExpectedSoundCalled(soundId: string): void {
            const expectedSoundPath = getFakeSoundPath(getFakeSoundId(soundId));
            expect(sounds[expectedSoundPath].play).toHaveBeenCalled();
        }
    });

    describe('Sound muting in DND mode', () => {
        beforeEach(() => isDndOn = true);

        it('should not play a new pull request sound', () => {
            soundManager.playNewPullRequestSound();
            assertExpectedSoundNotCalled(NotificationSound.NEW_PULLREQUEST);
        });

        it('should not play an approved pull request sound', () => {
            soundManager.playApprovedPullRequestSound();
            assertExpectedSoundNotCalled(NotificationSound.APPROVED_PULLREQUEST);
        });

        it('should not play a merged pull request sound', () => {
            soundManager.playMergedPullRequestSound();
            assertExpectedSoundNotCalled(NotificationSound.MERGED_PULLREQUEST);
        });

        it('should not play a reminder sound', () => {
            soundManager.playReminderSound();
            assertExpectedSoundNotCalled(NotificationSound.REMINDER);
        });

        function assertExpectedSoundNotCalled(soundId: string): void {
            const expectedSoundPath = getFakeSoundPath(getFakeSoundId(soundId));
            expect(sounds[expectedSoundPath].play).not.toHaveBeenCalled();
        }
    });

    function getFakeSoundId(soundKey): string {
        return `sound__${soundKey}`;
    }

    function getFakeSoundPath(soundKey): string {
        return `${soundKey}.mp3`;
    }
});
