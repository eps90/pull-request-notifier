///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    'use strict';

    var application = angular.module('bitbucketNotifier', []);
    application.directive('pullRequest', PullRequestComponent.factory());
}
