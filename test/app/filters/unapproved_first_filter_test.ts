/// <reference path="../../../app/_typings.ts" />

describe('UnapprovedFirstFilter', () => {
    var $filter;

    beforeEach(module('bitbucketNotifier'));
    beforeEach(inject([
        '$filter',
        ($f) => {
            $filter = $f;
        }
    ]));

    it('should sort reviewers with unapproved first', () => {
        var approvedReviewer = new BitbucketNotifier.Reviewer();
        approvedReviewer.approved = true;

        var unapprovedReviewer = new BitbucketNotifier.Reviewer();
        unapprovedReviewer.approved = false;

        var otherApproved = new BitbucketNotifier.Reviewer();
        otherApproved.approved = true;

        var otherUnapproved = new BitbucketNotifier.Reviewer();
        otherUnapproved.approved = false;

        var reviewers = [approvedReviewer, unapprovedReviewer, otherApproved, otherUnapproved];

        var unapprovedFirstFilter = $filter('unapprovedFirst');
        var actual = unapprovedFirstFilter(reviewers);

        expect(actual).toEqual([unapprovedReviewer, otherUnapproved, approvedReviewer, otherApproved]);
    });
});
