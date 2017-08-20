import * as angular from 'angular';
import {Reviewer} from '../../../app/models/reviewer';

describe('UnapprovedFirstFilter', () => {
    let $filter;

    beforeEach(angular.mock.module('bitbucketNotifier'));
    beforeEach(inject([
        '$filter',
        ($f) => {
            $filter = $f;
        }
    ]));

    it('should sort reviewers with unapproved first', () => {
        let approvedReviewer = new Reviewer();
        approvedReviewer.approved = true;

        let unapprovedReviewer = new Reviewer();
        unapprovedReviewer.approved = false;

        let otherApproved = new Reviewer();
        otherApproved.approved = true;

        let otherUnapproved = new Reviewer();
        otherUnapproved.approved = false;

        let reviewers = [approvedReviewer, unapprovedReviewer, otherApproved, otherUnapproved];

        let unapprovedFirstFilter = $filter('unapprovedFirst');
        let actual = unapprovedFirstFilter(reviewers);

        expect(actual).toEqual([unapprovedReviewer, otherUnapproved, approvedReviewer, otherApproved]);
    });
});
