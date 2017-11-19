import * as angular from 'angular';
import {MODULE_NAME} from '../../../../app/modules/bitbucket_notifier';
import {
    ApprovalProgressController
} from '../../../../app/components/approval_progress_component/approval_progress_controller';
import {PullRequestProgress} from '../../../../app/models/pull_request_progress';
import {User} from '../../../../app/models/user';
import {Reviewer} from '../../../../app/models/reviewer';
import {InMemoryConfigStorage} from '../../../../app/services/config/in_memory_config_storage';
import {ConfigObject} from '../../../../app/models/config_object';
import {ConfigProvider} from '../../../../app/services/config/config_provider';
import {Config} from '../../../../app/services/config/config';

describe('ApprovalProgressComponent', () => {
    let $scope: ng.IScope;
    let $compile: ng.ICompileService;
    let config: Config;
    let element;

    beforeEach(angular.mock.module(MODULE_NAME));
    beforeEach(angular.mock.module([
        'configProvider',
        (configProvider: ConfigProvider) => {
            const defaults = new Map([
                [ConfigObject.PULLREQUEST_PROGRESS, PullRequestProgress.PROPORTIONS]
            ]);
            configProvider.setDefaults(defaults);
            configProvider.useCustomStorage(new InMemoryConfigStorage());
        }
    ]));
    beforeEach(inject([
        '$compile',
        '$rootScope',
        'config',
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
            expect(ctrl.pullRequestProgress).toEqual(PullRequestProgress.PROPORTIONS);
        });

        it("should display proportions value if 'proportions' is set as progress option", () => {
            config.setItem(ConfigObject.PULLREQUEST_PROGRESS, PullRequestProgress.PROPORTIONS);

            element = $compile('<approval-progress reviewers="reviewers"></approval-progress>')($scope);
            $scope.$digest();

            expect(element.text()).toContain('1/3');
        });

        it("should display percentage value if 'percentage' is set as progress option", () => {
            config.setItem(ConfigObject.PULLREQUEST_PROGRESS, PullRequestProgress.PERCENT);

            element = $compile('<approval-progress reviewers="reviewers"></approval-progress>')($scope);
            $scope.$digest();

            expect(element.text()).toContain('33%');
        });

        it("should display progress bar of 'progress_bar' is set as progress option", () => {
            config.setItem(ConfigObject.PULLREQUEST_PROGRESS, PullRequestProgress.PROGRESS_BAR);

            element = $compile('<approval-progress reviewers="reviewers"></approval-progress>')($scope);
            $scope.$digest();

            expect(element.find('.progress').length).toEqual(1);
            expect(element.find('.progress-bar').css('width')).toEqual('33%');
        });

        it('should allow to override progress type by passing it to attribute', () => {
            config.setItem(ConfigObject.PULLREQUEST_PROGRESS, PullRequestProgress.PROGRESS_BAR);

            const bindings = {
                reviewers,
                mode: PullRequestProgress.PROGRESS_BAR
            };
            const ctrl = $componentController('approvalProgress', null, bindings) as ApprovalProgressController;
            ctrl.$onInit();

            expect(ctrl.pullRequestProgress).toEqual(PullRequestProgress.PROGRESS_BAR);
        });
    });
});
