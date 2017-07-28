var application = angular.module('bitbucketNotifier.background', ['LocalStorageModule', 'btford.socket-io']);

application.directive('background', BackgroundComponent.factory());

application.service('PullRequestRepository', PullRequestRepository);
application.service('NotificationRepository', NotificationRepository);
application.service('SocketManager', SocketManager);
application.service('SocketHandler', SocketHandler);
application.service('Notifier', Notifier);
application.service('Config', Config);
application.service('Indicator', Indicator);
application.service('SoundManager', SoundManager);
application.service('SoundRepository', SoundRepository);
