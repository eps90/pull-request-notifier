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
        const approvedReviewer = new Reviewer();
        approvedReviewer.approved = true;

        const unapprovedReviewer = new Reviewer();
        unapprovedReviewer.approved = false;

        const otherApproved = new Reviewer();
        otherApproved.approved = true;

        const otherUnapproved = new Reviewer();
        otherUnapproved.approved = false;

        const reviewers = [approvedReviewer, unapprovedReviewer, otherApproved, otherUnapproved];

        const unapprovedFirstFilter = $filter('unapprovedFirst');
        const actual = unapprovedFirstFilter(reviewers);

        expect(actual).toEqual([unapprovedReviewer, otherUnapproved, approvedReviewer, otherApproved]);
    });
});
