import * as angular from 'angular';

import {OptionsComponent} from "../components/options_component/options_component";
import {SectionTitleComponent} from "../components/section_title_component/section_title_component";
import {NavigationBarComponent} from "../components/navigation_bar_component/navigation_bar_component";
import {NavigationBrandComponent} from "../components/navigation_brand_component/navigation_brand_component";
import {ApprovalProgressComponent} from "../components/approval_progress_component/approval_progress_component";
import {Config} from "../services/config";
import {SoundManager} from "../services/sound_manager";
import {SoundRepository} from "../services/sound_repository";
import {Notifier} from "../services/notifier";
import {NotificationRepository} from "../services/notification_repository";

export const MODULE_NAME = 'bitbucketNotifier.options';
const application = angular.module(MODULE_NAME, ['LocalStorageModule', 'angular-growl']);

application.directive('options', OptionsComponent.factory());
application.directive('sectionTitle', SectionTitleComponent.factory());
application.directive('navigationBar', NavigationBarComponent.factory());
application.directive('navigationBrand', NavigationBrandComponent.factory());
application.directive('approvalProgress', ApprovalProgressComponent.factory());
application.service('Config', Config);
application.service('SoundManager', SoundManager);
application.service('SoundRepository', SoundRepository);
application.service('Notifier', Notifier);
application.service('NotificationRepository', NotificationRepository);

application.value('bitbucketUrl', 'https://bitbucket.org');

application.config(['growlProvider', (growlProvider: angular.growl.IGrowlProvider) => {
    growlProvider.globalPosition('top-center');
    growlProvider.globalTimeToLive(5000);
    growlProvider.globalDisableCountDown(true);
}]);
