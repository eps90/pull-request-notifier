import * as angular from 'angular';
import 'angular-cookies';

import {OptionsComponent} from '../components/options_component/options_component';
import {SectionTitleComponent} from '../components/section_title_component/section_title_component';
import {NavigationBarComponent} from '../components/navigation_bar_component/navigation_bar_component';
import {NavigationBrandComponent} from '../components/navigation_brand_component/navigation_brand_component';
import {ApprovalProgressComponent} from '../components/approval_progress_component/approval_progress_component';
import {SoundManager} from '../services/sound_manager';
import {SoundRepository} from '../services/sound_repository';
import {Notifier} from '../services/notifier';
import {NotificationRepository} from '../services/notification_repository';
import 'angular-loggly-logger';
import 'angular-google-analytics';
import 'angular-translate';
import 'angular-translate-handler-log';
import 'angular-translate-storage-local';
import 'angular-translate-storage-cookie';
import 'messageformat';
import 'angular-translate-interpolation-messageformat';
import {setUpLogglyLogger} from '../helpers/loggly';
import {setUpAnalytics, setUpAnalyticsTrackPrefix} from '../helpers/analytics';
import {getLanguages, setUpI18n} from '../helpers/i18n';
import {AnalyticsEventDispatcher} from '../services/analytics_event_dispatcher';
import {TimeTracker} from '../services/time_tracker';
import {LanguageRepository} from '../services/language_repository/language_repository';
import {DoNotDisturbService} from '../services/do_not_disturb_service';
import './eps_config';
import {setUpConfig} from '../helpers/config';

export const MODULE_NAME = 'bitbucketNotifier.options';
const application = angular.module(
    MODULE_NAME,
    [
        'angular-growl',
        'logglyLogger',
        'angular-google-analytics',
        'pascalprecht.translate',
        'ngCookies',
        'eps.config'
    ]);

application.component('options', new OptionsComponent());
application.component('sectionTitle', new SectionTitleComponent());
application.component('navigationBar', new NavigationBarComponent());
application.component('navigationBrand', new NavigationBrandComponent());
application.component('approvalProgress', new ApprovalProgressComponent());
application.service('SoundManager', SoundManager);
application.service('SoundRepository', SoundRepository);
application.service('Notifier', Notifier);
application.service('NotificationRepository', NotificationRepository);
application.service('AnalyticsEventDispatcher', AnalyticsEventDispatcher);
application.service('TimeTracker', TimeTracker);
application.service('LanguageRepository', LanguageRepository);
application.service('DndService', DoNotDisturbService);

application.value('bitbucketUrl', 'https://bitbucket.org');
application.value('languages', getLanguages());

application.config(['growlProvider', (growlProvider: angular.growl.IGrowlProvider) => {
    growlProvider.globalPosition('top-center');
    growlProvider.globalTimeToLive(5000);
    growlProvider.globalDisableCountDown(true);
}]);

if (PRODUCTION) {
    application.config(['$compileProvider', ($compileProvider: ng.ICompileProvider) =>  {
        $compileProvider.debugInfoEnabled(false);
        $compileProvider.cssClassDirectivesEnabled(false);
        $compileProvider.commentDirectivesEnabled(false);
    }]);
}

setUpLogglyLogger(application);
setUpAnalytics(application);
setUpAnalyticsTrackPrefix(application, 'options.html');
setUpI18n(application);
setUpConfig(application);

application.run(['Analytics', (analytics) => {}]);
