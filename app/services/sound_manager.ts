import {Config} from "./config";
import {NotificationSound, Sound} from "./models";
import {HowlSoundFactory} from "./factories";
import {SoundRepository} from "./sound_repository";

export class SoundManager {

    static $inject: string[] = ['Config', 'SoundRepository'];

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

    playNewPullRequestSound(): void {
        this.sounds[NotificationSound.NEW_PULLREQUEST].play();
    }

    playApprovedPullRequestSound(): void {
        this.sounds[NotificationSound.APPROVED_PULLREQUEST].play();
    }

    playMergedPullRequestSound(): void {
        this.sounds[NotificationSound.MERGED_PULLREQUEST].play();
    }

    playReminderSound(): void {
        this.sounds[NotificationSound.REMINDER].play();
    }

    private addHowlSound(soundType: string, sound: Sound): void {
        this.sounds[soundType] = HowlSoundFactory.createSound(sound.soundPath);
    }
}
