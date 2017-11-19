import {SoundRepository} from './sound_repository';
import {NotificationSound} from '../models/notification_sound';
import {Sound} from '../models/sound';
import {HowlSoundFactory} from './factory/howl_sound_factory';
import {DoNotDisturbService} from './do_not_disturb_service';
import {Config} from './config/config';
import {ConfigObject} from '../models/config_object';

export class SoundManager {

    public static $inject: string[] = ['config', 'SoundRepository', 'DndService'];

    private sounds: {[key: string]: Howl};

    constructor(
        private config: Config,
        private soundRepository: SoundRepository,
        private dndService: DoNotDisturbService
    ) {
        this.sounds = {};
        this.addHowlSound(
            NotificationSound.NEW_PULLREQUEST,
            soundRepository.findById(config.getItem(ConfigObject.NEW_PULLREQUEST_SOUND))
        );
        this.addHowlSound(
            NotificationSound.APPROVED_PULLREQUEST,
            soundRepository.findById(config.getItem(ConfigObject.APPROVED_PULLREQUEST_SOUND))
        );
        this.addHowlSound(
            NotificationSound.MERGED_PULLREQUEST,
            soundRepository.findById(config.getItem(ConfigObject.MERGED_PULLREQUEST_SOUND))
        );
        this.addHowlSound(
            NotificationSound.REMINDER,
            soundRepository.findById(config.getItem(ConfigObject.REMINDER_SOUND))
        );
    }

    public playNewPullRequestSound(): void {
        this.playSound(NotificationSound.NEW_PULLREQUEST);
    }

    public playApprovedPullRequestSound(): void {
        this.playSound(NotificationSound.APPROVED_PULLREQUEST);
    }

    public playMergedPullRequestSound(): void {
        this.playSound(NotificationSound.MERGED_PULLREQUEST);
    }

    public playReminderSound(): void {
        this.playSound(NotificationSound.REMINDER);
    }

    private addHowlSound(soundType: string, sound: Sound): void {
        this.sounds[soundType] = HowlSoundFactory.createSound(sound.soundPath);
    }

    private playSound(soundId: string): void {
        if (!this.dndService.isDndOn()) {
            this.sounds[soundId].play();
        }
    }
}
