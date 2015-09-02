///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    'use strict';

    var application = angular.module('bitbucketNotifier.options', ['LocalStorageModule', 'angular-growl']);

    application.directive('options', OptionsComponent.factory());
    application.directive('sectionTitle', SectionTitleComponent.factory());
    application.service('Config', Config);
}
