import {Sound} from "./models";

export class SoundRepository {
    /** @todo Add sounds from json or yaml */
    /** @todo Allow to add custom sounds, get them from config */
    private sounds: Sound[] = [
        new Sound('ring', require('./../../assets/sounds/notification.ogg'), 'Ring'),
        new Sound('bell', require('./../../assets/sounds/notification2.ogg'), 'Bell'),
        new Sound('alarm', require('./../../assets/sounds/nuclear_alarm.ogg'), 'Nuclear alarm'),
        new Sound('empty', null, 'None')
    ];

    findAll(): Sound[] {
        return this.sounds;
    }

    findById(soundId: string): Sound {
        const allSounds = this.findAll();
        for (let sound of allSounds) {
            if (sound.id === soundId) {
                return sound;
            }
        }

        return null;
    }
}
