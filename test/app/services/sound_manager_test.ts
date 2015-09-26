///<reference path="../../../app/_typings.ts"/>

describe('SoundManager', () => {
    var soundManager: BitbucketNotifier.SoundManager,
        config: BitbucketNotifier.Config;

    beforeEach(() => {
        window['createjs'] = {
            Sound: {
                registerSound: jasmine.createSpy('createjs.Sound.registerSound'),
                play: jasmine.createSpy('createjs.Sound.play')
            }
        };
    });
    beforeEach(module('bitbucketNotifier.background'));
    beforeEach(module([
        '$provide',
        ($provide: ng.auto.IProvideService) => {
            function getFakeSoundPath(soundKey): string {
                return 'sound__' + soundKey + '.ogg';
            }

            $provide.value('Config', {
                'getNewPullRequestSound': jasmine.createSpy('Config.getNewPullRequest').and.callFake(() => {
                    return getFakeSoundPath(BitbucketNotifier.Sound.NEW_PULLREQUEST);
                }),
                'getApprovedPullRequestSound': jasmine.createSpy('Config.getApprovedPullRequest').and.callFake(() => {
                    return getFakeSoundPath(BitbucketNotifier.Sound.APPROVED_PULLREQUEST);
                }),
                'getMergedPullRequestSound': jasmine.createSpy('Config.getMergedPullRequest').and.callFake(() => {
                    return getFakeSoundPath(BitbucketNotifier.Sound.MERGED_PULLREQUEST);
                }),
                'getReminderSound': jasmine.createSpy('Config.getReminder').and.callFake(() => {
                    return getFakeSoundPath(BitbucketNotifier.Sound.REMINDER);
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
        var soundManagerInstance = new BitbucketNotifier.SoundManager(config);
        /* tslint:enable */
        testSoundRegistration(BitbucketNotifier.Sound.NEW_PULLREQUEST);
        testSoundRegistration(BitbucketNotifier.Sound.APPROVED_PULLREQUEST);
        testSoundRegistration(BitbucketNotifier.Sound.MERGED_PULLREQUEST);
        testSoundRegistration(BitbucketNotifier.Sound.REMINDER);
    });

    it('should be able to play a sound', () => {
        var soundName = 'some_sound_id';
        soundManager.play(soundName);
        expect(createjs.Sound.play).toHaveBeenCalledWith(soundName);
    });

    it('should be able to play a new pull request sound', () => {
        soundManager.playNewPullRequestSound();
        expect(createjs.Sound.play).toHaveBeenCalledWith(BitbucketNotifier.Sound.NEW_PULLREQUEST);
    });

    it('should be able to play an approved pull request sound', () => {
        soundManager.playApprovedPullRequestSound();
        expect(createjs.Sound.play).toHaveBeenCalledWith(BitbucketNotifier.Sound.APPROVED_PULLREQUEST);
    });

    it('should be able to play a merged pull request sound', () => {
        soundManager.playMergedPullRequestSound();
        expect(createjs.Sound.play).toHaveBeenCalledWith(BitbucketNotifier.Sound.MERGED_PULLREQUEST);
    });

    it('should be able to play a reminder sound', () => {
        soundManager.playReminderSound();
        expect(createjs.Sound.play).toHaveBeenCalledWith(BitbucketNotifier.Sound.REMINDER);
    });
});
