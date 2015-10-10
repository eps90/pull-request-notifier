///<reference path="../../../app/_typings.ts"/>

describe('SoundRepository', () => {
    var soundRepository: BitbucketNotifier.SoundRepository;

    beforeEach(module('bitbucketNotifier.background'));
    beforeEach(inject([
        'SoundRepository',
        (sr) => {
            soundRepository = sr;
        }
    ]));

    it('should return all available sounds', () => {
        var actual = soundRepository.findAll();
        expect(actual.length).toBeGreaterThan(0);

        for (let i = 0, len = actual.length; i < len; i++) {
            expect(actual[i] instanceof BitbucketNotifier.Sound).toBeTruthy();
        }
    });

    it('should return a sound by its label', () => {
        var labelToFindBy: string = 'Ring';
        var actual: BitbucketNotifier.Sound = soundRepository.findByLabel(labelToFindBy);
        expect(actual.label).toEqual('Ring');

        var nonExistantSoundLabel: string = 'Not found';
        var actual: BitbucketNotifier.Sound = soundRepository.findByLabel(nonExistantSoundLabel);
        expect(actual).toBeNull();
    });
});
