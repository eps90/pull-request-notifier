///<reference path="../../../app/_typings.ts"/>

describe('Models', () => {
    describe('PullRequest', () => {
        it('should be able to determine equality to other PullRequest object', () => {
            var commonId = 1;
            var differentId = 2;

            var commonProject = new BitbucketNotifier.Project();
            commonProject.fullName = 'team_name/repo_name';
            var otherProject = new BitbucketNotifier.Project();
            otherProject.fullName = 'aaa/bbb';

            var pullRequest = new BitbucketNotifier.PullRequest();
            pullRequest.id = commonId;
            pullRequest.targetRepository = commonProject;

            var samePullRequest = new BitbucketNotifier.PullRequest();
            samePullRequest.id = commonId;
            samePullRequest.targetRepository = commonProject;

            var differentPullRequest = new BitbucketNotifier.PullRequest();
            differentPullRequest.id = commonId;
            differentPullRequest.targetRepository = otherProject;

            var anotherDifferentPr = new BitbucketNotifier.PullRequest();
            anotherDifferentPr.id = differentId;
            anotherDifferentPr.targetRepository = commonProject;

            expect(pullRequest.equals(samePullRequest)).toBeTruthy();
            expect(samePullRequest.equals(pullRequest)).toBeTruthy();
            expect(pullRequest.equals(differentPullRequest)).toBeFalsy();
            expect(pullRequest.equals(anotherDifferentPr)).toBeFalsy();
            expect(samePullRequest.equals(differentPullRequest)).toBeFalsy();
        });

        it('should be able to return reviewers as an array of usernames', () => {
            var userOne = new BitbucketNotifier.User();
            userOne.username = 'john.smith';
            var userTwo = new BitbucketNotifier.User();
            userTwo.username = 'anna.kowalsky';

            var reviewerOne = new BitbucketNotifier.Reviewer();
            reviewerOne.user = userOne;

            var reviewerTwo = new BitbucketNotifier.Reviewer();
            reviewerTwo.user = userTwo;

            var pullRequest = new BitbucketNotifier.PullRequest();
            pullRequest.reviewers = [reviewerOne, reviewerTwo];

            expect(pullRequest.getReviewersList()).toEqual(['john.smith', 'anna.kowalsky']);
        });
    });
});
