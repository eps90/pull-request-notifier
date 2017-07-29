import {Reviewer} from "../../../app/services/models";
import * as angular from 'angular';

describe('UnapprovedFirstFilter', () => {
    var $filter;

    beforeEach(angular.mock.module('bitbucketNotifier'));
    beforeEach(inject([
        '$filter',
        ($f) => {
            $filter = $f;
        }
    ]));

    it('should sort reviewers with unapproved first', () => {
        var approvedReviewer = new Reviewer();
        approvedReviewer.approved = true;

        var unapprovedReviewer = new Reviewer();
        unapprovedReviewer.approved = false;

        var otherApproved = new Reviewer();
        otherApproved.approved = true;

        var otherUnapproved = new Reviewer();
        otherUnapproved.approved = false;

        var reviewers = [approvedReviewer, unapprovedReviewer, otherApproved, otherUnapproved];

        var unapprovedFirstFilter = $filter('unapprovedFirst');
        var actual = unapprovedFirstFilter(reviewers);

        expect(actual).toEqual([unapprovedReviewer, otherUnapproved, approvedReviewer, otherApproved]);
    });
});
