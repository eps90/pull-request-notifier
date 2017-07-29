import {BackgroundComponent} from "../components/background_component/background_component";
import {PullRequestRepository} from "../services/pull_request_repository";
import {NotificationRepository} from "../services/notification_repository";
import {SocketManager} from "../services/socket_manager";
import {SocketHandler} from "../services/socket_handler";
import {Notifier} from "../services/notifier";
import {Config} from "../services/config";
import {Indicator} from "../services/indicator";
import {SoundManager} from "../services/sound_manager";
import {SoundRepository} from "../services/sound_repository";

import * as angular from 'angular';

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
