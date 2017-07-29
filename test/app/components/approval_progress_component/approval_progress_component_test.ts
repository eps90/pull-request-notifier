import {Config} from "../../../../app/services/config";
import {PullRequestProgress, Reviewer, User} from "../../../../app/services/models";
import * as angular from 'angular';

describe('ApprovalProgressComponent', () => {
    var $scope: ng.IScope,
        $compile: ng.ICompileService,
        config: Config,
        element,
        prProgress = null;

    beforeEach(angular.mock.module('bitbucketNotifier'));
    beforeEach(angular.mock.module('bitbucketNotifier.templates'));
    beforeEach(angular.mock.module([
        '$provide',
        ($provide: ng.auto.IProvideService) => {
            prProgress = PullRequestProgress.PROPORTIONS;

            $provide.value('Config', {
                getPullRequestProgress: jasmine.createSpy('Config.getPullRequestProgress').and.callFake(() => {
                    return prProgress;
                })
            });
        }
    ]));
    beforeEach(inject([
        '$compile',
        '$rootScope',
        'Config',
        ($c, $r, c) => {
            $compile = $c;
            $scope = $r;
            config = c;
        }
    ]));

    it('should display number of approvals per assigned users count', () => {
        var approvingReviewer = new Reviewer();
        approvingReviewer.user = new User();
        approvingReviewer.approved = true;

        var disapprovingReviewer = new Reviewer();
        disapprovingReviewer.user = new User();
        disapprovingReviewer.approved = false;

        $scope['reviewers'] = [approvingReviewer, disapprovingReviewer];
        element = $compile('<approval-progress reviewers="reviewers"></approval-progress>')($scope);
        $scope.$digest();

        expect(element.text().trim()).toEqual('1/2');
    });

    it('should display a cross icon if no user has been assigned', () => {
        $scope['reviewers'] = [];
        element = $compile('<approval-progress reviewers="reviewers"></approval-progress>')($scope);
        $scope.$digest();

        expect(element.find('i.icon-no-assigned').length).toBe(1);
    });

    describe('Appearance variants', () => {
        beforeEach(() => {
            var approvedReviewer = new Reviewer();
            approvedReviewer.approved = true;
            var unapprovedReviewer = new Reviewer();
            unapprovedReviewer.approved = false;
            var anotherUnapprovedReviewer = new Reviewer();
            anotherUnapprovedReviewer.approved = false;

            $scope['reviewers'] = [approvedReviewer, unapprovedReviewer, anotherUnapprovedReviewer];
        });

        it('should set up currently set pull request progress option', () => {
            element = $compile('<approval-progress reviewers="reviewers"></approval-progress>')($scope);
            $scope.$digest();

            expect(element.isolateScope()['pullRequestProgress']).toEqual(prProgress);
        });

        it("should display proportions value if 'proportions' is set as progress option", () => {
            prProgress = PullRequestProgress.PROPORTIONS;
            element = $compile('<approval-progress reviewers="reviewers"></approval-progress>')($scope);
            $scope.$digest();

            expect(element.text()).toContain('1/3');
        });

        it("should display percentage value if 'percentage' is set as progress option", () => {
            prProgress = PullRequestProgress.PERCENT;
            element = $compile('<approval-progress reviewers="reviewers"></approval-progress>')($scope);
            $scope.$digest();

            expect(element.text()).toContain('33%');
        });

        it("should display progress bar of 'progress_bar' is set as progress option", () => {
            prProgress = PullRequestProgress.PROGRESS_BAR;
            element = $compile('<approval-progress reviewers="reviewers"></approval-progress>')($scope);
            $scope.$digest();

            expect(element.find('.progress').length).toEqual(1);
            expect(element.find('.progress-bar').css('width')).toEqual('33%');
        });

        it('should allow to override progress type by passing it to attribute', () => {
            prProgress = PullRequestProgress.PERCENT;
            element = $compile('<approval-progress reviewers="reviewers" mode="progress_bar"></approval-progress>')($scope);
            $scope.$digest();

            expect(element.isolateScope()['pullRequestProgress']).toEqual('progress_bar');
        });
    });
});
