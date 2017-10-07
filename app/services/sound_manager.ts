import {Config} from './config';
import {SoundRepository} from './sound_repository';
import {NotificationSound} from '../models/notification_sound';
import {Sound} from '../models/sound';
import {HowlSoundFactory} from './factory/howl_sound_factory';

export class SoundManager {

    public static $inject: string[] = ['Config', 'SoundRepository'];

    private sounds: {[key: string]: Howl};

    constructor(private config: Config, private soundRepository: SoundRepository) {
        this.sounds = {};
        this.addHowlSound(
            NotificationSound.NEW_PULLREQUEST,
            soundRepository.findById(config.getNewPullRequestSound())
        );
        this.addHowlSound(
            NotificationSound.APPROVED_PULLREQUEST,
            soundRepository.findById(config.getApprovedPullRequestSound())
        );
        this.addHowlSound(
            NotificationSound.MERGED_PULLREQUEST,
            soundRepository.findById(config.getMergedPullRequestSound())
        );
        this.addHowlSound(
            NotificationSound.REMINDER,
            soundRepository.findById(config.getReminderSound())
        );
    }

    public playNewPullRequestSound(): void {
        this.sounds[NotificationSound.NEW_PULLREQUEST].play();
    }

    public playApprovedPullRequestSound(): void {
        this.sounds[NotificationSound.APPROVED_PULLREQUEST].play();
    }

    public playMergedPullRequestSound(): void {
        this.sounds[NotificationSound.MERGED_PULLREQUEST].play();
    }

    public playReminderSound(): void {
        this.sounds[NotificationSound.REMINDER].play();
    }

    private addHowlSound(soundType: string, sound: Sound): void {
        this.sounds[soundType] = HowlSoundFactory.createSound(sound.soundPath);
    }
}
