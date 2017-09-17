import * as angular from 'angular';

import {OptionsComponent} from '../components/options_component/options_component';
import {SectionTitleComponent} from '../components/section_title_component/section_title_component';
import {NavigationBarComponent} from '../components/navigation_bar_component/navigation_bar_component';
import {NavigationBrandComponent} from '../components/navigation_brand_component/navigation_brand_component';
import {ApprovalProgressComponent} from '../components/approval_progress_component/approval_progress_component';
import {Config} from '../services/config';
import {SoundManager} from '../services/sound_manager';
import {SoundRepository} from '../services/sound_repository';
import {Notifier} from '../services/notifier';
import {NotificationRepository} from '../services/notification_repository';
import 'angular-loggly-logger';
import 'angular-google-analytics';
import {setUpLogglyLogger} from '../helpers/loggly';
import {setUpAnalytics, setUpAnalyticsTrackPrefix} from '../helpers/analytics';
import {AnalyticsEventDispatcher} from '../services/analytics_event_dispatcher';

export const MODULE_NAME = 'bitbucketNotifier.options';
const application = angular.module(
    MODULE_NAME,
    [
        'LocalStorageModule',
        'angular-growl',
        'logglyLogger',
        'angular-google-analytics'
    ]);

application.component('options', new OptionsComponent());
application.component('sectionTitle', new SectionTitleComponent());
application.component('navigationBar', new NavigationBarComponent());
application.component('navigationBrand', new NavigationBrandComponent());
application.component('approvalProgress', new ApprovalProgressComponent());
application.service('Config', Config);
application.service('SoundManager', SoundManager);
application.service('SoundRepository', SoundRepository);
application.service('Notifier', Notifier);
application.service('NotificationRepository', NotificationRepository);
application.service('AnalyticsEventDispatcher', AnalyticsEventDispatcher);

application.value('bitbucketUrl', 'https://bitbucket.org');

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

application.run(['Analytics', (analytics) => {}]);
