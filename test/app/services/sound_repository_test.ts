import {SoundRepository} from "../../../app/services/sound_repository";
import {Sound} from "../../../app/services/models";
import * as angular from 'angular';

describe('SoundRepository', () => {
    var soundRepository: SoundRepository;

    beforeEach(angular.mock.module('bitbucketNotifier.background'));
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
            expect(actual[i] instanceof Sound).toBeTruthy();
        }
    });

    it('should return a sound by its label', () => {
        var labelToFindBy: string = 'Ring';
        var actual: Sound = soundRepository.findByLabel(labelToFindBy);
        expect(actual.label).toEqual('Ring');

        var nonExistantSoundLabel: string = 'Not found';
        actual = soundRepository.findByLabel(nonExistantSoundLabel);
        expect(actual).toBeNull();
    });
});
