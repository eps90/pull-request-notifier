import * as angular from 'angular';

import {PullRequestComponent} from "../components/pull_request_component/pull_request_component";
import {PullRequestsListComponent} from "../components/pull_requests_list_component/pull_requests_list_component";
import {PullRequestsHeaderComponent} from "../components/pull_requests_header_component/pull_requests_header_component";
import {ApprovalProgressComponent} from "../components/approval_progress_component/approval_progress_component";
import {UserVoteComponent} from "../components/user_vote_component/user_vote_component";
import {SectionTitleComponent} from "../components/section_title_component/section_title_component";
import {PullRequestLinkComponent} from "../components/pull_request_link_component/pull_request_link_component";
import {NavigationBarComponent} from "../components/navigation_bar_component/navigation_bar_component";
import {NavigationBrandComponent} from "../components/navigation_brand_component/navigation_brand_component";
import {ReminderComponent} from "../components/reminder_component/reminder_component";
import {PullRequestPreviewComponent} from "../components/pull_request_preview_component/pull_request_preview_component";
import {ReviewerComponent} from "../components/reviewer_component/reviewer_component";
import {AuthoredFilter} from "../filters/authored_filter";
import {AssignedFilter} from "../filters/assigned_filter";
import {UnapprovedFirst} from "../filters/unapproved_first_filter";
import {PullRequestRepository} from "../services/pull_request_repository";
import {SoundRepository} from "../services/sound_repository";
import {Config} from "../services/config";
import {RoutingConfiguration} from "../config/routing";

export const MODULE_NAME = 'bitbucketNotifier';

const application = angular.module(MODULE_NAME, [
    'LocalStorageModule',
    'ui.bootstrap',
    'dbaq.emoji',
    'ngSanitize',
    'ui.router',
    'ng-showdown',
    'ngAnimate'
]);
application.component('pullRequest', new PullRequestComponent());
application.component('pullRequestsList', new PullRequestsListComponent());
application.component('pullRequestsHeader', new PullRequestsHeaderComponent());
application.component('approvalProgress', new ApprovalProgressComponent());
application.directive('userVote', UserVoteComponent.factory());
application.directive('sectionTitle', SectionTitleComponent.factory());
application.component('pullRequestLink', new PullRequestLinkComponent());
application.component('navigationBar', new NavigationBarComponent());
application.component('navigationBrand', new NavigationBrandComponent());
application.component('reminder', new ReminderComponent());
application.component('pullRequestPreview', new PullRequestPreviewComponent());
application.component('reviewer', new ReviewerComponent());

application.filter('authored' , AuthoredFilter);
application.filter('assigned', AssignedFilter);
application.filter('unapprovedFirst', UnapprovedFirst);

application.service('PullRequestRepository', PullRequestRepository);
application.service('SoundRepository', SoundRepository);
application.service('Config', Config);

application.value('bitbucketUrl', 'https://bitbucket.org');

application.config(RoutingConfiguration);

if (PRODUCTION) {
    application.config(['$compileProvider', ($compileProvider: ng.ICompileProvider) =>  {
        $compileProvider.debugInfoEnabled(false);
        $compileProvider.cssClassDirectivesEnabled(false);
        $compileProvider.commentDirectivesEnabled(false);
    }]);
}
