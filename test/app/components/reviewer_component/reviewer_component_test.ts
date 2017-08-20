import * as angular from 'angular';
import {Reviewer} from "../../../../app/models/reviewer";

describe('ReviewerComponent', () => {
    var element: ng.IAugmentedJQuery,
        $scope: ng.IScope,
        $compile: ng.ICompileService;

    beforeEach(angular.mock.module('bitbucketNotifier'));
    beforeEach(
        inject([
            '$rootScope',
            '$compile',
            ($r: ng.IRootScopeService, $c) => {
                $scope = $r.$new();
                $compile = $c;
            }
        ])
    );

    it('should display user name', () => {
        var reviewer: Reviewer = new Reviewer();
        reviewer.user.displayName = "John Smith";
        $scope['reviewer'] = reviewer;

        element = $compile('<reviewer r="reviewer"></reviewer>')($scope);
        $scope.$digest();

        expect(element.text()).toContain(reviewer.user.displayName);
    });

    describe('approval status', () => {
        it('should display approval status for up-vote', () => {
            var approvedReviewer: Reviewer = new Reviewer();
            approvedReviewer.user.displayName = "John Smith";
            approvedReviewer.approved = true;

            $scope['reviewer'] = approvedReviewer;

            element = $compile('<reviewer r="reviewer"></reviewer>')($scope);
            $scope.$digest();

            expect(element.find('.reviewer').hasClass('approved')).toBeTruthy();
        });

        it('should display approval status for up-vote', () => {
            var unapprovedReviewer: Reviewer = new Reviewer();
            unapprovedReviewer.user.displayName = "John Smith";
            unapprovedReviewer.approved = false;

            $scope['reviewer'] = unapprovedReviewer;

            element = $compile('<reviewer r="reviewer"></reviewer>')($scope);
            $scope.$digest();

            expect(element.find('.reviewer').hasClass('unapproved')).toBeTruthy();
        });
    });
});
