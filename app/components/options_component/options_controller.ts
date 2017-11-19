import {SoundRepository} from '../../services/sound_repository';
import {Notifier} from '../../services/notifier';
import {Howl} from 'howler';
import {Sound} from '../../models/sound';
import {PullRequest} from '../../models/pull_request';
import {User} from '../../models/user';
import {LanguageRepositoryInterface} from '../../services/language_repository/language_repository_interface';
import {Language} from '../../models/language';
import {Config} from '../../services/config/config';
import {ConfigObject} from '../../models/config_object';

export class OptionsController implements ng.IComponentController {
    public examples: any;
    public options: any;
    public sounds: Sound[];
    public languages: Language[];

    public static $inject: string[] = [
        'config',
        'growl',
        '$interval',
        'SoundRepository',
        'Notifier',
        'LanguageRepository',
        '$translate'
    ];

    constructor(
        private config: Config,
        private growl: angular.growl.IGrowlService,
        private $interval: ng.IIntervalService,
        private soundRepository: SoundRepository,
        private notifier: Notifier,
        private languageRepository: LanguageRepositoryInterface,
        private $translate: angular.translate.ITranslateService
    ) {}

    public $onInit = () => {
        this.examples = {
            reviewers: [
                {
                    approved: true
                },
                {
                    approved: false
                },
                {
                    approved: false
                }
            ]
        };

        // @todo Anyone know how to test it? :)
        this.$interval(
            () => {
                const approvalsCount = this.examples.reviewers.reduce(
                    (prev, curr: {approved: boolean}) => {
                        return curr.approved ? prev + 1 : prev;
                    },
                    0
                );

                switch (approvalsCount) {
                    case 0:
                        this.examples.reviewers[0].approved = true;
                        break;
                    case 1:
                        this.examples.reviewers[1].approved = true;
                        break;
                    case 2:
                        this.examples.reviewers[2].approved = true;
                        break;
                    case 3:
                        this.examples.reviewers[0].approved = false;
                        this.examples.reviewers[1].approved = false;
                        this.examples.reviewers[2].approved = false;
                        break;
                    default:
                        break;
                }
            },
            1000
        );

        this.options = {
            appUser: this.config.getItem(ConfigObject.USER),
            socketServerAddress: this.config.getItem(ConfigObject.SOCKET_SERVER),
            pullRequestProgress: this.config.getItem(ConfigObject.PULLREQUEST_PROGRESS),
            newPullRequestSound: this.config.getItem(ConfigObject.NEW_PULLREQUEST_SOUND),
            approvedPullRequestSound: this.config.getItem(ConfigObject.APPROVED_PULLREQUEST_SOUND),
            mergedPullRequestSound: this.config.getItem(ConfigObject.MERGED_PULLREQUEST_SOUND),
            reminderSound: this.config.getItem(ConfigObject.REMINDER_SOUND),
            chosenLanguage: this.config.getItem(ConfigObject.LANGUAGE)
        };

        this.sounds = this.soundRepository.findAll();
        this.languages = this.languageRepository.findAll();
    }

    public saveOptions(): void {
        this.config.save(new Map([
            [ConfigObject.USER, this.options.appUser],
            [ConfigObject.SOCKET_SERVER, this.options.socketServerAddress],
            [ConfigObject.PULLREQUEST_PROGRESS, this.options.pullRequestProgress],
            [ConfigObject.NEW_PULLREQUEST_SOUND, this.options.newPullRequestSound],
            [ConfigObject.APPROVED_PULLREQUEST_SOUND, this.options.approvedPullRequestSound],
            [ConfigObject.MERGED_PULLREQUEST_SOUND, this.options.mergedPullRequestSound],
            [ConfigObject.REMINDER_SOUND, this.options.reminderSound],
            [ConfigObject.LANGUAGE, this.options.chosenLanguage],
        ]));

        this.growl.success(this.$translate.instant('OPTIONS.GROWL.SETTINGS_APPLIED'));
        this.growl.warning(
            this.$translate.instant('OPTIONS.GROWL.EXTENSION_WILL_CLOSE'),
            {
                disableCountDown: false,
                onclose: (): void => {
                    window['chrome'].runtime.reload();
                }
            }
        );
    }

    public playSound(soundId: string): void {
        const sound = this.soundRepository.findById(soundId);
        const tempSound = new Howl({
            src: [sound.soundPath]
        });
        tempSound.play();
    }

    public showNotification(type: string): void {
        const pullRequest = new PullRequest();
        pullRequest.title = 'This is some title';
        pullRequest.author.displayName = 'John smith';

        const user = new User();
        user.displayName = 'Anna Kowalsky';

        const targetLink = 'http://bitbucket.com';

        switch (type) {
            case 'assigned':
                this.notifier.notifyNewPullRequestAssigned(pullRequest);
                break;
            case 'approved':
                this.notifier.notifyPullRequestApproved(pullRequest, user);
                break;
            case 'merged':
                this.notifier.notifyPullRequestMerged(pullRequest);
                break;
            case 'remind':
                this.notifier.notifyReminder(pullRequest);
                break;
            case 'updated':
                this.notifier.notifyPullRequestUpdated(pullRequest);
                break;
            case 'commented':
                this.notifier.notifyNewCommentAdded(pullRequest, user, targetLink);
                break;
            case 'replied':
                this.notifier.notifyNewReplyOnComment(pullRequest, user, targetLink);
                break;
            default:
                break;
        }
    }

    public changeLanguage() {
        this.config.setItem(ConfigObject.LANGUAGE, this.options.chosenLanguage);
    }
}
