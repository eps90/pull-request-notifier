import {Howl} from 'howler';

export class HowlSoundFactory {
    public static createSound(soundPath: string): Howl {
        return new Howl({
            src: [soundPath]
        });
    }
}
