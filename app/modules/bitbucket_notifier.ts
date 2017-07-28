var application = angular.module('bitbucketNotifier', [
    'LocalStorageModule',
    'ui.bootstrap',
    'emoji',
    'ngSanitize',
    'ui.router',
    'btford.markdown',
    'ngAnimate'
]);
application.directive('pullRequest', PullRequestComponent.factory());
application.directive('pullRequestsList', PullRequestsListComponent.factory());
application.directive('pullRequestsHeader', PullRequestsHeaderComponent.factory());
application.directive('approvalProgress', ApprovalProgressComponent.factory());
application.directive('userVote', UserVoteComponent.factory());
application.directive('sectionTitle', SectionTitleComponent.factory());
application.directive('pullRequestLink', PullRequestLinkComponent.factory());
application.directive('navigationBar', NavigationBarComponent.factory());
application.directive('navigationBrand', NavigationBrandComponent.factory());
application.directive('reminder', ReminderComponent.factory());
application.directive('pullRequestPreview', PullRequestPreviewComponent.factory());
application.directive('reviewer', ReviewerComponent.factory());

application.filter('authored' , AuthoredFilter);
application.filter('assigned', AssignedFilter);
application.filter('unapprovedFirst', UnapprovedFirst);

application.service('PullRequestRepository', PullRequestRepository);
application.service('SoundRepository', SoundRepository);
application.service('Config', Config);

application.value('bitbucketUrl', 'https://bitbucket.org');

application.config(RoutingConfiguration);
