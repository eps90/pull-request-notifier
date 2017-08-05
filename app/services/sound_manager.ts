import {Config} from "./config";
import {NotificationSound} from "./models";

export class SoundManager {

    static $inject: string[] = ['Config'];

    constructor(private config: Config) {
        createjs.Sound.registerSound(config.getNewPullRequestSound(), NotificationSound.NEW_PULLREQUEST);
        createjs.Sound.registerSound(config.getApprovedPullRequestSound(), NotificationSound.APPROVED_PULLREQUEST);
        createjs.Sound.registerSound(config.getMergedPullRequestSound(), NotificationSound.MERGED_PULLREQUEST);
        createjs.Sound.registerSound(config.getReminderSound(), NotificationSound.REMINDER);
    }

    playNewPullRequestSound(): void {
        createjs.Sound.play(NotificationSound.NEW_PULLREQUEST);
    }

    playApprovedPullRequestSound(): void {
        createjs.Sound.play(NotificationSound.APPROVED_PULLREQUEST);
    }

    playMergedPullRequestSound(): void {
        createjs.Sound.play(NotificationSound.MERGED_PULLREQUEST);
    }

    playReminderSound(): void {
        createjs.Sound.play(NotificationSound.REMINDER);
    }
}
