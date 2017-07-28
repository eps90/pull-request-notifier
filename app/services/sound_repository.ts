export class SoundRepository {
    private defaultSoundsPath: string = '../../assets/sounds/';
    private defaultSounds: Sound[] = [
        new Sound(`${this.defaultSoundsPath}notification.ogg`, 'Ring'),
        new Sound(`${this.defaultSoundsPath}notification2.ogg`, 'Bell'),
        new Sound(`${this.defaultSoundsPath}nuclear_alarm.ogg`, 'Nuclear alarm')
    ];

    findAll(): Sound[] {
        return this.defaultSounds;
    }

    findByLabel(soundLabel: string): Sound {
        var allSounds = this.findAll();
        for (let i = 0, len = allSounds.length; i < len; i++) {
            var sound = allSounds[i];
            if (sound.label === soundLabel) {
                return sound;
            }
        }

        return null;
    }
}
