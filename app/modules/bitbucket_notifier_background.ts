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
import 'angular-google-analytics';
import 'angular-translate';
import {setUpLogglyLogger} from '../helpers/loggly';
import {setUpAnalytics, setUpAnalyticsTrackPrefix} from '../helpers/analytics';
import {setUpI18n} from '../helpers/i18n';
import {AnalyticsEventDispatcher} from '../services/analytics_event_dispatcher';
import {TimeTracker} from '../services/time_tracker';
import {PopupOpenedTimingEvent} from '../models/analytics_event/popup_opened_timing_event';

export const MODULE_NAME = 'bitbucketNotifier.background';
const application = angular.module(
    MODULE_NAME,
    [
        'LocalStorageModule',
        'btford.socket-io',
        'logglyLogger',
        'angular-google-analytics',
        'pascalprecht.translate'
    ]);

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
application.service('AnalyticsEventDispatcher', AnalyticsEventDispatcher);
application.service('TimeTracker', TimeTracker);

if (PRODUCTION) {
    application.config(['$compileProvider', ($compileProvider: ng.ICompileProvider) =>  {
        $compileProvider.debugInfoEnabled(false);
        $compileProvider.cssClassDirectivesEnabled(false);
        $compileProvider.commentDirectivesEnabled(false);
    }]);
}

setUpLogglyLogger(application);
setUpAnalytics(application);
setUpAnalyticsTrackPrefix(application, 'background.html');
setUpI18n(application);

application.run(['Analytics', 'TimeTracker', (analytics, timeTracker: TimeTracker) => {
    if (!TEST) {
        window['chrome'].runtime.onConnect.addListener((externalPort) => {
            const event = new PopupOpenedTimingEvent();
            timeTracker.start(event);

            externalPort.onDisconnect.addListener(() => {
                timeTracker.stop(event);
            });
        });
    }
}]);
