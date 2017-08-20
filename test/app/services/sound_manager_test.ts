import {SoundManager} from '../../../app/services/sound_manager';
import {Config} from '../../../app/services/config';
import {SoundRepository} from '../../../app/services/sound_repository';
import * as angular from 'angular';
import {HowlSoundFactory} from '../../../app/services/factories';
import {NotificationSound} from '../../../app/models/notification_sound';
import {Sound} from '../../../app/models/sound';

describe('SoundManager', () => {
    let soundManager: SoundManager,
        soundRepository: SoundRepository,
        config: Config,
        sounds;

    beforeEach(function collectSounds(): void {
        sounds = {};
        const counter = 0;
        spyOn(HowlSoundFactory, 'createSound').and.callFake((soundPath) => {
            sounds[soundPath] = jasmine.createSpyObj(`Howl#${counter}`, ['play']);
            return sounds[soundPath];
        });
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
        }
    ]));
    beforeEach(inject([
        'SoundManager',
        'Config',
        'SoundRepository',
        (sm, c, sr) => {
            soundManager = sm;
            config = c;
            soundRepository = sr;
        }
    ]));

    it('it should register sounds from config on startup', () => {
        let calls = 0;
        function testSoundRegistration(soundKey): void {
            expect((HowlSoundFactory.createSound as jasmine.Spy).calls.argsFor(calls++))
                .toEqual(['sound__' + soundKey + '.mp3']);
        }

        new SoundManager(config, soundRepository);

        testSoundRegistration(NotificationSound.NEW_PULLREQUEST);
        testSoundRegistration(NotificationSound.APPROVED_PULLREQUEST);
        testSoundRegistration(NotificationSound.MERGED_PULLREQUEST);
        testSoundRegistration(NotificationSound.REMINDER);
    });

    describe('Sound playing', () => {
        it('should be able to play a new pull request sound', () => {
            soundManager.playNewPullRequestSound();

            const expectedSoundPath = getFakeSoundPath(getFakeSoundId(NotificationSound.NEW_PULLREQUEST));
            expect(sounds[expectedSoundPath].play).toHaveBeenCalled();
        });

        it('should be able to play an approved pull request sound', () => {
            soundManager.playApprovedPullRequestSound();

            const expectedSoundPath = getFakeSoundPath(getFakeSoundId(NotificationSound.APPROVED_PULLREQUEST));
            expect(sounds[expectedSoundPath].play).toHaveBeenCalled();
        });

        it('should be able to play a merged pull request sound', () => {
            soundManager.playMergedPullRequestSound();

            const expectedSoundPath = getFakeSoundPath(getFakeSoundId(NotificationSound.MERGED_PULLREQUEST));
            expect(sounds[expectedSoundPath].play).toHaveBeenCalled();
        });

        it('should be able to play a reminder sound', () => {
            soundManager.playReminderSound();

            const expectedSoundPath = getFakeSoundPath(getFakeSoundId(NotificationSound.REMINDER));
            expect(sounds[expectedSoundPath].play).toHaveBeenCalled();
        });
    });

    function getFakeSoundId(soundKey): string {
        return `sound__${soundKey}`;
    }

    function getFakeSoundPath(soundKey): string {
        return `${soundKey}.mp3`;
    }
});
