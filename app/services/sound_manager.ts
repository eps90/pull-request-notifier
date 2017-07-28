export class SoundManager {

    static $inject: string[] = ['Config'];

    constructor(private config: Config) {
        createjs.Sound.registerSound(config.getNewPullRequestSound(), Sound.NEW_PULLREQUEST);
        createjs.Sound.registerSound(config.getApprovedPullRequestSound(), Sound.APPROVED_PULLREQUEST);
        createjs.Sound.registerSound(config.getMergedPullRequestSound(), Sound.MERGED_PULLREQUEST);
        createjs.Sound.registerSound(config.getReminderSound(), Sound.REMINDER);
    }

    playNewPullRequestSound(): void {
        createjs.Sound.play(Sound.NEW_PULLREQUEST);
    }

    playApprovedPullRequestSound(): void {
        createjs.Sound.play(Sound.APPROVED_PULLREQUEST);
    }

    playMergedPullRequestSound(): void {
        createjs.Sound.play(Sound.MERGED_PULLREQUEST);
    }

    playReminderSound(): void {
        createjs.Sound.play(Sound.REMINDER);
    }
}
