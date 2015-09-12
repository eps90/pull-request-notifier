///<reference path="../../_typings.ts"/>

module BitbucketNotifier {
    'use strict';

    export class OptionsComponent implements ng.IDirective {
        restrict: string =  'E';
        templateUrl: string = '../components/options_component/options_component.html';

        constructor(private config: Config, private growl: angular.growl.IGrowlService) {}

        link: ng.IDirectiveLinkFn = (scope: ng.IScope) => {
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
            var component = (config, growl) => new OptionsComponent(config, growl);
            component.$inject = ['Config', 'growl'];
            return component;
        }
    }
}
