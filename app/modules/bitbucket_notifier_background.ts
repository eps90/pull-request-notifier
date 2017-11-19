import * as angular from 'angular';
import 'angular-cookies';

import {BackgroundComponent} from '../components/background_component/background_component';
import {PullRequestRepository} from '../services/pull_request_repository';
import {NotificationRepository} from '../services/notification_repository';
import {SocketManager} from '../services/socket_manager';
import {SocketHandler} from '../services/socket_handler';
import {Notifier} from '../services/notifier';
import {Indicator} from '../services/indicator';
import {SoundManager} from '../services/sound_manager';
import {SoundRepository} from '../services/sound_repository';
import 'angular-loggly-logger';
import 'angular-google-analytics';
import 'angular-translate';
import 'angular-translate-storage-local';
import 'angular-translate-storage-cookie';
import 'angular-translate-handler-log';
import 'messageformat';
import 'angular-translate-interpolation-messageformat';
import {setUpLogglyLogger} from '../helpers/loggly';
import {setUpAnalytics, setUpAnalyticsTrackPrefix} from '../helpers/analytics';
import {getLanguages, setUpI18n} from '../helpers/i18n';
import {setUpDnd} from '../helpers/dnd';
import {AnalyticsEventDispatcher} from '../services/analytics_event_dispatcher';
import {TimeTracker} from '../services/time_tracker';
import {PopupOpenedTimingEvent} from '../models/analytics_event/popup_opened_timing_event';
import {LanguageRepository} from '../services/language_repository/language_repository';
import {DoNotDisturbService} from '../services/do_not_disturb_service';
import './eps_config';

export const MODULE_NAME = 'bitbucketNotifier.background';
const application = angular.module(
    MODULE_NAME,
    [
        'btford.socket-io',
        'logglyLogger',
        'angular-google-analytics',
        'pascalprecht.translate',
        'ngCookies',
        'eps.config'
    ]);

application.directive('background', BackgroundComponent.factory());

application.service('PullRequestRepository', PullRequestRepository);
application.service('NotificationRepository', NotificationRepository);
application.service('SocketManager', SocketManager);
application.service('SocketHandler', SocketHandler);
application.service('Notifier', Notifier);
application.service('Indicator', Indicator);
application.service('SoundManager', SoundManager);
application.service('SoundRepository', SoundRepository);
application.service('AnalyticsEventDispatcher', AnalyticsEventDispatcher);
application.service('TimeTracker', TimeTracker);
application.service('LanguageRepository', LanguageRepository);
application.service('DndService', DoNotDisturbService);

application.value('languages', getLanguages());

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

application.run(
    [
        'Analytics',
        'TimeTracker',
        'DndService',
        '$translate',
        (
            analytics,
            timeTracker: TimeTracker,
            dndService: DoNotDisturbService,
            $translate: angular.translate.ITranslateService
        ) => {
            if (!TEST) {
                chrome.runtime.onConnect.addListener((externalPort) => {
                    const event = new PopupOpenedTimingEvent();
                    timeTracker.start(event);

                    externalPort.onDisconnect.addListener(() => {
                        timeTracker.stop(event);
                    });
                });
                setUpDnd(dndService, $translate);
            }
        }
    ]
);
