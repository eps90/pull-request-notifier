import * as angular from 'angular';

import {BackgroundComponent} from '../components/background_component/background_component';
import {PullRequestRepository} from '../services/pull_request_repository';
import {NotificationRepository} from '../services/notification_repository';
import {SocketManager} from '../services/socket_manager';
import {SocketHandler} from '../services/socket_handler';
import {Notifier} from '../services/notifier';
import {Config} from '../services/config';
import {Indicator} from '../services/indicator';
import {SoundManager} from '../services/sound_manager';
import {SoundRepository} from '../services/sound_repository';
import 'angular-loggly-logger';

export const MODULE_NAME = 'bitbucketNotifier.background';
const application = angular.module(MODULE_NAME, ['LocalStorageModule', 'btford.socket-io', 'logglyLogger']);

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

if (PRODUCTION) {
    application.config(['$compileProvider', ($compileProvider: ng.ICompileProvider) =>  {
        $compileProvider.debugInfoEnabled(false);
        $compileProvider.cssClassDirectivesEnabled(false);
        $compileProvider.commentDirectivesEnabled(false);
    }]);
}

if (process.env.LOGGLY_TOKEN.length > 0) {
    application.config(['LogglyLoggerProvider', (logglyLoggerProvider) => {
        logglyLoggerProvider
            .inputToken(process.env.LOGGLY_TOKEN)
            .sendConsoleErrors(true);
    }]);
}
