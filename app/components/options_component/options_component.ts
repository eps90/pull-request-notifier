///<reference path="../../_typings.ts"/>

module BitbucketNotifier {
    'use strict';

    export class OptionsComponent implements ng.IDirective {
        restrict: string =  'E';
        templateUrl: string = '../components/options_component/options_component.html';

        constructor(private config: Config, private growl: angular.growl.IGrowlService, private $interval: ng.IIntervalService) {}

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
                pullRequestProgress: this.config.getPullRequestProgress()
            };

            scope['saveOptions'] = () => {
                this.config.setUsername(scope['options'].appUser);
                this.config.setSocketServerAddress(scope['options'].socketServerAddress);
                this.config.setPullRequestProgress(scope['options'].pullRequestProgress);

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
        };

        static factory(): ng.IDirectiveFactory {
            var component = (config, growl, $interval) => new OptionsComponent(config, growl, $interval);
            component.$inject = ['Config', 'growl', '$interval'];
            return component;
        }
    }
}
