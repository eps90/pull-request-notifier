///<reference path="../../../../app/_typings.ts"/>

describe('ApprovalProgressComponent', () => {
    var $scope: ng.IScope,
        $compile: ng.ICompileService,
        config: BitbucketNotifier.Config,
        element,
        prProgress = null;

    beforeEach(module('bitbucketNotifier'));
    beforeEach(module('bitbucketNotifier.templates'));
    beforeEach(module([
        '$provide',
        ($provide: ng.auto.IProvideService) => {
            prProgress = BitbucketNotifier.PullRequestProgress.PROPORTIONS;

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
        var approvingReviewer = new BitbucketNotifier.Reviewer();
        approvingReviewer.user = new BitbucketNotifier.User();
        approvingReviewer.approved = true;

        var disapprovingReviewer = new BitbucketNotifier.Reviewer();
        disapprovingReviewer.user = new BitbucketNotifier.User();
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
            var approvedReviewer = new BitbucketNotifier.Reviewer();
            approvedReviewer.approved = true;
            var unapprovedReviewer = new BitbucketNotifier.Reviewer();
            unapprovedReviewer.approved = false;
            var anotherUnapprovedReviewer = new BitbucketNotifier.Reviewer();
            anotherUnapprovedReviewer.approved = false;

            $scope['reviewers'] = [approvedReviewer, unapprovedReviewer, anotherUnapprovedReviewer];
        });

        it('should set up currently set pull request progress option', () => {
            element = $compile('<approval-progress reviewers="reviewers"></approval-progress>')($scope);
            $scope.$digest();

            expect(element.isolateScope()['pullRequestProgress']).toEqual(prProgress);
        });

        it("should display proportions value if 'proportions' is set as progress option", () => {
            prProgress = BitbucketNotifier.PullRequestProgress.PROPORTIONS;
            element = $compile('<approval-progress reviewers="reviewers"></approval-progress>')($scope);
            $scope.$digest();

            expect(element.text()).toContain('1/3');
        });

        it("should display percentage value if 'percentage' is set as progress option", () => {
            prProgress = BitbucketNotifier.PullRequestProgress.PERCENT;
            element = $compile('<approval-progress reviewers="reviewers"></approval-progress>')($scope);
            $scope.$digest();

            expect(element.text()).toContain('33%');
        });

        it("should display progress bar of 'progress_bar' is set as progress option", () => {
            prProgress = BitbucketNotifier.PullRequestProgress.PROGRESS_BAR;
            element = $compile('<approval-progress reviewers="reviewers"></approval-progress>')($scope);
            $scope.$digest();

            expect(element.find('.progress').length).toEqual(1);
            expect(element.find('.progress-bar').css('width')).toEqual('33%');
        });
    });
});
