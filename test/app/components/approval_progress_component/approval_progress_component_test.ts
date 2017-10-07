import {Config} from '../../../../app/services/config';
import * as angular from 'angular';
import {MODULE_NAME} from '../../../../app/modules/bitbucket_notifier';
import {
    ApprovalProgressController
} from '../../../../app/components/approval_progress_component/approval_progress_controller';
import {PullRequestProgress} from '../../../../app/models/pull_request_progress';
import {User} from '../../../../app/models/user';
import {Reviewer} from '../../../../app/models/reviewer';

describe('ApprovalProgressComponent', () => {
    let $scope: ng.IScope;
    let $compile: ng.ICompileService;
    let config: Config;
    let element;
    let prProgress = null;

    beforeEach(angular.mock.module(MODULE_NAME));
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
            $scope = $r.$new();
            config = c;
        }
    ]));

    it('should display number of approvals per assigned users count', () => {
        const approvingReviewer = new Reviewer();
        approvingReviewer.user = new User();
        approvingReviewer.approved = true;

        const disapprovingReviewer = new Reviewer();
        disapprovingReviewer.user = new User();
        disapprovingReviewer.approved = false;

        $scope.reviewers = [approvingReviewer, disapprovingReviewer];
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
        let $componentController: ng.IComponentControllerService;
        let reviewers: Reviewer[];

        beforeEach(inject([
            '$componentController',
            ($cc) => {
                $componentController = $cc;
            }
        ]));

        beforeEach(() => {
            const approvedReviewer = new Reviewer();
            approvedReviewer.approved = true;
            const unapprovedReviewer = new Reviewer();
            unapprovedReviewer.approved = false;
            const anotherUnapprovedReviewer = new Reviewer();
            anotherUnapprovedReviewer.approved = false;

            reviewers = [approvedReviewer, unapprovedReviewer, anotherUnapprovedReviewer];
            $scope['reviewers'] = reviewers;
        });

        it('should set up currently set pull request progress option', () => {
            const bindings = {
                reviewers
            };
            const ctrl = $componentController('approvalProgress', null, bindings) as ApprovalProgressController;
            ctrl.$onInit();
            expect(ctrl.pullRequestProgress).toEqual(prProgress);
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
            const bindings = {
                reviewers,
                mode: 'progress_bar'
            };
            const ctrl = $componentController('approvalProgress', null, bindings) as ApprovalProgressController;
            ctrl.$onInit();

            expect(ctrl.pullRequestProgress).toEqual('progress_bar');
        });
    });
});
