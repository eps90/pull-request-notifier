///<reference path="../../../../app/_typings.ts"/>

describe('ApprovalProgressComponent', () => {
    var $scope: ng.IScope,
        $compile: ng.ICompileService,
        element;

    beforeEach(module('bitbucketNotifier'));
    beforeEach(module('bitbucketNotifier.templates'));
    beforeEach(inject([
        '$compile',
        '$rootScope',
        ($c, $r) => {
            $compile = $c;
            $scope = $r;
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
});
