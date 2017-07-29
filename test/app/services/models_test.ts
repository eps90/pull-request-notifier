import {Project, PullRequest, Reviewer, User} from "../../../app/services/models";

describe('Models', () => {
    describe('PullRequest', () => {
        it('should be able to determine equality to other PullRequest object', () => {
            var commonId = 1;
            var differentId = 2;

            var commonProject = new Project();
            commonProject.fullName = 'team_name/repo_name';
            var otherProject = new Project();
            otherProject.fullName = 'aaa/bbb';

            var pullRequest = new PullRequest();
            pullRequest.id = commonId;
            pullRequest.targetRepository = commonProject;

            var samePullRequest = new PullRequest();
            samePullRequest.id = commonId;
            samePullRequest.targetRepository = commonProject;

            var differentPullRequest = new PullRequest();
            differentPullRequest.id = commonId;
            differentPullRequest.targetRepository = otherProject;

            var anotherDifferentPr = new PullRequest();
            anotherDifferentPr.id = differentId;
            anotherDifferentPr.targetRepository = commonProject;

            expect(pullRequest.equals(samePullRequest)).toBeTruthy();
            expect(samePullRequest.equals(pullRequest)).toBeTruthy();
            expect(pullRequest.equals(differentPullRequest)).toBeFalsy();
            expect(pullRequest.equals(anotherDifferentPr)).toBeFalsy();
            expect(samePullRequest.equals(differentPullRequest)).toBeFalsy();
        });

        it('should be able to return reviewers as an array of usernames', () => {
            var userOne = new User();
            userOne.username = 'john.smith';
            var userTwo = new User();
            userTwo.username = 'anna.kowalsky';

            var reviewerOne = new Reviewer();
            reviewerOne.user = userOne;

            var reviewerTwo = new Reviewer();
            reviewerTwo.user = userTwo;

            var pullRequest = new PullRequest();
            pullRequest.reviewers = [reviewerOne, reviewerTwo];

            expect(pullRequest.getReviewersList()).toEqual(['john.smith', 'anna.kowalsky']);
        });

        it('should be able to determine whether is is merge-ready', () => {
            var approvedReviewer = new Reviewer();
            approvedReviewer.approved = true;

            var unapprovedReviewer = new Reviewer();
            unapprovedReviewer.approved = false;

            var readyPr = new PullRequest();
            readyPr.reviewers = [approvedReviewer];

            var pendingPr = new PullRequest();
            pendingPr.reviewers = [unapprovedReviewer];

            var anotherPendningPr = new PullRequest();
            anotherPendningPr.reviewers = [approvedReviewer, unapprovedReviewer];

            expect(readyPr.isMergeReady()).toBeTruthy();
            expect(pendingPr.isMergeReady()).toBeFalsy();
            expect(anotherPendningPr.isMergeReady()).toBeFalsy();
        });
    });

    describe('Project', () => {
        describe('slugify', () => {
            it('should slugify repository name', () => {
                var projectProvider: [{repoName: string; expectedSlug: string}] = [
                    {
                        repoName: 'team/repo',
                        expectedSlug: 'team__repo'
                    },
                    {
                        repoName: 'team_name/repository',
                        expectedSlug: 'team_name__repository'
                    },
                    {
                        repoName: 'team_name/repo_name',
                        expectedSlug: 'team_name__repo_name'
                    }
                ];

                for (let testIdx = 0, len = projectProvider.length; testIdx < len; testIdx++) {
                    let testData = projectProvider[testIdx];

                    let project = new Project();
                    project.fullName = testData.repoName;

                    let actual = project.slugify();

                    expect(actual).toEqual(testData.expectedSlug);
                }
            });

            it('should deslugify slugified repository name', () => {
                var slugsProvider: [{slug: string; expected: string}] = [
                    {
                        slug: 'team__repo',
                        expected: 'team/repo'
                    },
                    {
                        slug: 'team_repo__repo_name',
                        expected: 'team_repo/repo_name'
                    }
                ];

                for (let testIdx = 0, len = slugsProvider.length; testIdx < len; testIdx++) {
                    let testData = slugsProvider[testIdx];

                    var actual = Project.deslugify(testData.slug);
                    expect(actual).toEqual(testData.expected);
                }
            });
        });
    });
});
