///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    'use strict';

    var application = angular.module('bitbucketNotifier', ['LocalStorageModule']);
    application.directive('pullRequest', PullRequestComponent.factory());
    application.directive('pullRequestsList', PullRequestsListComponent.factory());
    application.directive('approvalProgress', ApprovalProgressComponent.factory());
    application.directive('userVote', UserVoteComponent.factory());

    application.filter('authored' , AuthoredFilter);
    application.filter('assigned', AssignedFilter);
}
