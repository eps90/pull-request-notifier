import {SoundManager} from "../../../app/services/sound_manager";
import {Config} from "../../../app/services/config";
import {NotificationSound} from "../../../app/services/models";
import * as angular from 'angular';

describe('SoundManager', () => {
    var soundManager: SoundManager,
        config: Config;

    beforeEach(() => {
        window['createjs'] = {
            Sound: {
                registerSound: jasmine.createSpy('createjs.Sound.registerSound'),
                play: jasmine.createSpy('createjs.Sound.play')
            }
        };
    });
    beforeEach(angular.mock.module('bitbucketNotifier.background'));
    beforeEach(angular.mock.module([
        '$provide',
        ($provide: ng.auto.IProvideService) => {
            function getFakeSoundPath(soundKey): string {
                return 'sound__' + soundKey + '.ogg';
            }

            $provide.value('Config', {
                'getNewPullRequestSound': jasmine.createSpy('Config.getNewPullRequest').and.callFake(() => {
                    return getFakeSoundPath(NotificationSound.NEW_PULLREQUEST);
                }),
                'getApprovedPullRequestSound': jasmine.createSpy('Config.getApprovedPullRequest').and.callFake(() => {
                    return getFakeSoundPath(NotificationSound.APPROVED_PULLREQUEST);
                }),
                'getMergedPullRequestSound': jasmine.createSpy('Config.getMergedPullRequest').and.callFake(() => {
                    return getFakeSoundPath(NotificationSound.MERGED_PULLREQUEST);
                }),
                'getReminderSound': jasmine.createSpy('Config.getReminder').and.callFake(() => {
                    return getFakeSoundPath(NotificationSound.REMINDER);
                })
            });
        }
    ]));
    beforeEach(inject([
        'SoundManager',
        'Config',
        (sm, c) => {
            soundManager = sm;
            config = c;
        }
    ]));

    it('it should register sounds from config on startup', () => {
        var calls = 0;
        function testSoundRegistration(soundKey): void {
            var spy = <jasmine.Spy> createjs.Sound.registerSound;
            expect(spy.calls.argsFor(calls++)).toEqual(['sound__' + soundKey + '.ogg', soundKey]);
        }

        /* tslint:disable */
        var soundManagerInstance = new SoundManager(config);
        /* tslint:enable */
        testSoundRegistration(NotificationSound.NEW_PULLREQUEST);
        testSoundRegistration(NotificationSound.APPROVED_PULLREQUEST);
        testSoundRegistration(NotificationSound.MERGED_PULLREQUEST);
        testSoundRegistration(NotificationSound.REMINDER);
    });

    it('should be able to play a new pull request sound', () => {
        soundManager.playNewPullRequestSound();
        expect(createjs.Sound.play).toHaveBeenCalledWith(NotificationSound.NEW_PULLREQUEST);
    });

    it('should be able to play an approved pull request sound', () => {
        soundManager.playApprovedPullRequestSound();
        expect(createjs.Sound.play).toHaveBeenCalledWith(NotificationSound.APPROVED_PULLREQUEST);
    });

    it('should be able to play a merged pull request sound', () => {
        soundManager.playMergedPullRequestSound();
        expect(createjs.Sound.play).toHaveBeenCalledWith(NotificationSound.MERGED_PULLREQUEST);
    });

    it('should be able to play a reminder sound', () => {
        soundManager.playReminderSound();
        expect(createjs.Sound.play).toHaveBeenCalledWith(NotificationSound.REMINDER);
    });
});
