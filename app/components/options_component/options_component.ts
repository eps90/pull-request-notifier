import {Config} from "../../services/config";
import {SoundRepository} from "../../services/sound_repository";
import {Notifier} from "../../services/notifier";
import {PullRequest, User} from "../../services/models";
import componentTemplate from './options_component.html';
import {Howl} from 'howler';

export class OptionsComponent implements ng.IDirective {
    restrict: string =  'E';
    template: string = componentTemplate;

    constructor(
        private config: Config,
        private growl: angular.growl.IGrowlService,
        private $interval: ng.IIntervalService,
        private soundRepository: SoundRepository,
        private notifier: Notifier
    ) {}

    link: ng.IDirectiveLinkFn = (scope: ng.IScope) => {
        scope['examples'] = {
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
                var approvalsCount = scope['examples'].reviewers.reduce(
                    (prev, curr: {approved: boolean}) => {
                        return curr.approved ? prev + 1 : prev;
                    },
                    0
                );

                switch (approvalsCount) {
                    case 0:
                        scope['examples'].reviewers[0].approved = true;
                        break;
                    case 1:
                        scope['examples'].reviewers[1].approved = true;
                        break;
                    case 2:
                        scope['examples'].reviewers[2].approved = true;
                        break;
                    case 3:
                        scope['examples'].reviewers[0].approved = false;
                        scope['examples'].reviewers[1].approved = false;
                        scope['examples'].reviewers[2].approved = false;
                        break;
                    default:
                        break;
                }
            },
            1000
        );

        scope['options'] = {
            appUser: this.config.getUsername(),
            socketServerAddress: this.config.getSocketServerAddress(),
            pullRequestProgress: this.config.getPullRequestProgress(),
            newPullRequestSound: this.config.getNewPullRequestSound(),
            approvedPullRequestSound: this.config.getApprovedPullRequestSound(),
            mergedPullRequestSound: this.config.getApprovedPullRequestSound(),
            reminderSound: this.config.getReminderSound()
        };

        scope['saveOptions'] = () => {
            this.config.setUsername(scope['options'].appUser);
            this.config.setSocketServerAddress(scope['options'].socketServerAddress);
            this.config.setPullRequestProgress(scope['options'].pullRequestProgress);
            this.config.setNewPullRequestSound(scope['options'].newPullRequestSound);
            this.config.setApprovedPullRequestSound(scope['options'].approvedPullRequestSound);
            this.config.setMergedPullRequestSound(scope['options'].mergedPullRequestSound);
            this.config.setReminderSound(scope['options'].reminderSound);

            this.growl.success('Settings applied!');
            this.growl.warning(
                'Extension will reboot in in 5 seconds',
                {
                    disableCountDown: false,
                    onclose: () : void => {
                        window['chrome'].runtime.reload();
                    }
                }
            );
        };

        scope['sounds'] = this.soundRepository.findAll();
        scope['playSound'] = (soundId: string) => {
            const sound = this.soundRepository.findById(soundId);
            const tempSound = new Howl({
                src: [sound.soundPath]
            });
            tempSound.play();
        };

        scope['showNotification'] = (type: string) => {
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
            }
        };
    };

    static factory(): ng.IDirectiveFactory {
        const component = (config, growl, $interval, soundRepository, notifier) => new OptionsComponent(config, growl, $interval, soundRepository, notifier);
        component.$inject = ['Config', 'growl', '$interval', 'SoundRepository', 'Notifier'];
        return component;
    }
}
