import {SoundRepository} from "../../../app/services/sound_repository";
import {Sound} from "../../../app/services/models";
import * as angular from 'angular';

describe('SoundRepository', () => {
    let soundRepository: SoundRepository;

    beforeEach(angular.mock.module('bitbucketNotifier.background'));
    beforeEach(inject([
        'SoundRepository',
        (sr) => {
            soundRepository = sr;
        }
    ]));

    it('should return all available sounds', () => {
        const actual = soundRepository.findAll();
        expect(actual.length).toBeGreaterThan(0);

        for (let i = 0, len = actual.length; i < len; i++) {
            expect(actual[i] instanceof Sound).toBeTruthy();
        }
    });

    it('should return a sound by its id', () => {
        const idToFindBy: string = 'ring';
        const foundSound: Sound = soundRepository.findById(idToFindBy);
        expect(foundSound.label).toEqual('Ring');

        const missingSoundId: string = 'Not found';
        const missingSound = soundRepository.findById(missingSoundId);
        expect(missingSound).toBeNull();
    });
});
