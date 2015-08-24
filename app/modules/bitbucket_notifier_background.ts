///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    'use strict';

    var application = angular.module('bitbucketNotifier.background', ['LocalStorageModule', 'btford.socket-io']);

    application.directive('background', BackgroundComponent.factory());

    application.service('PullRequestRepository', PullRequestRepository);
    application.factory('Socket', Socket);
    application.service('SocketHandler', SocketHandler);
    application.service('Notifier', Notifier);
    application.service('Config', Config);
    application.service('Indicator', Indicator);
}