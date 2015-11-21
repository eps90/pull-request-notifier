///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    'use strict';

    var application = angular.module('bitbucketNotifier', ['LocalStorageModule', 'ui.bootstrap', 'emoji', 'ngSanitize']);
    application.directive('pullRequest', PullRequestComponent.factory());
    application.directive('pullRequestsList', PullRequestsListComponent.factory());
    application.directive('pullRequestsHeader', PullRequestsHeaderComponent.factory());
    application.directive('approvalProgress', ApprovalProgressComponent.factory());
    application.directive('userVote', UserVoteComponent.factory());
    application.directive('sectionTitle', SectionTitleComponent.factory());
    application.directive('pullRequestLink', PullRequestLinkComponent.factory());
    application.directive('navigationBar', NavigationBarComponent.factory());
    application.directive('reminder', ReminderComponent.factory());
    application.directive('pullRequestPreview', PullRequestPreviewComponent.factory());

    application.filter('authored' , AuthoredFilter);
    application.filter('assigned', AssignedFilter);

    application.service('PullRequestRepository', PullRequestRepository);
    application.service('SoundRepository', SoundRepository);
    application.service('Config', Config);

    application.value('bitbucketUrl', 'https://bitbucket.org');
}
