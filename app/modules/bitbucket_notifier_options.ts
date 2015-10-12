///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    'use strict';

    var application = angular.module('bitbucketNotifier.options', ['LocalStorageModule', 'angular-growl']);

    application.directive('options', OptionsComponent.factory());
    application.directive('sectionTitle', SectionTitleComponent.factory());
    application.directive('navigationBar', NavigationBarComponent.factory());
    application.directive('approvalProgress', ApprovalProgressComponent.factory());
    application.service('Config', Config);
    application.service('SoundManager', SoundManager);
    application.service('SoundRepository', SoundRepository);

    application.value('bitbucketUrl', 'https://bitbucket.org');

    application.config(['growlProvider', (growlProvider: angular.growl.IGrowlProvider) => {
        growlProvider.globalPosition('top-center');
        growlProvider.globalTimeToLive(5000);
        growlProvider.globalDisableCountDown(true);
    }]);
}
