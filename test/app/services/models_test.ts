import {Project} from '../../../app/models/project';
import {PullRequest} from '../../../app/models/pull_request';
import {Reviewer} from '../../../app/models/reviewer';
import {User} from '../../../app/models/user';

describe('Models', () => {
    describe('PullRequest', () => {
        it('should be able to determine equality to other PullRequest object', () => {
            const commonId = 1;
            const differentId = 2;

            const commonProject = new Project();
            commonProject.fullName = 'team_name/repo_name';
            const otherProject = new Project();
            otherProject.fullName = 'aaa/bbb';

            const pullRequest = new PullRequest();
            pullRequest.id = commonId;
            pullRequest.targetRepository = commonProject;

            const samePullRequest = new PullRequest();
            samePullRequest.id = commonId;
            samePullRequest.targetRepository = commonProject;

            const differentPullRequest = new PullRequest();
            differentPullRequest.id = commonId;
            differentPullRequest.targetRepository = otherProject;

            const anotherDifferentPr = new PullRequest();
            anotherDifferentPr.id = differentId;
            anotherDifferentPr.targetRepository = commonProject;

            expect(pullRequest.equals(samePullRequest)).toBeTruthy();
            expect(samePullRequest.equals(pullRequest)).toBeTruthy();
            expect(pullRequest.equals(differentPullRequest)).toBeFalsy();
            expect(pullRequest.equals(anotherDifferentPr)).toBeFalsy();
            expect(samePullRequest.equals(differentPullRequest)).toBeFalsy();
        });

        it('should be able to return reviewers as an array of user uuids', () => {
            const userOne = new User();
            userOne.uuid = 'uuidhash';
            const userTwo = new User();
            userTwo.uuid = 'uuidhash2';

            const reviewerOne = new Reviewer();
            reviewerOne.user = userOne;

            const reviewerTwo = new Reviewer();
            reviewerTwo.user = userTwo;

            const pullRequest = new PullRequest();
            pullRequest.reviewers = [reviewerOne, reviewerTwo];

            expect(pullRequest.getReviewersList()).toEqual(['uuidhash', 'uuidhash2']);
        });

        it('should be able to determine whether is is merge-ready', () => {
            const approvedReviewer = new Reviewer();
            approvedReviewer.approved = true;

            const unapprovedReviewer = new Reviewer();
            unapprovedReviewer.approved = false;

            const readyPr = new PullRequest();
            readyPr.reviewers = [approvedReviewer];

            const pendingPr = new PullRequest();
            pendingPr.reviewers = [unapprovedReviewer];

            const anotherPendningPr = new PullRequest();
            anotherPendningPr.reviewers = [approvedReviewer, unapprovedReviewer];

            expect(readyPr.isMergeReady()).toBeTruthy();
            expect(pendingPr.isMergeReady()).toBeFalsy();
            expect(anotherPendningPr.isMergeReady()).toBeFalsy();
        });
    });

    describe('Project', () => {
        describe('slugify', () => {
            it('should slugify repository name', () => {
                const projectProvider: Array<{ repoName: string; expectedSlug: string }> = [
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

                for (const testData of projectProvider) {
                    const project = new Project();
                    project.fullName = testData.repoName;

                    const actual = project.slugify();

                    expect(actual).toEqual(testData.expectedSlug);
                }
            });

            it('should deslugify slugified repository name', () => {
                const slugsProvider: Array<{slug: string; expected: string}> = [
                    {
                        slug: 'team__repo',
                        expected: 'team/repo'
                    },
                    {
                        slug: 'team_repo__repo_name',
                        expected: 'team_repo/repo_name'
                    }
                ];

                for (const testData of slugsProvider) {
                    const actual = Project.deslugify(testData.slug);
                    expect(actual).toEqual(testData.expected);
                }
            });
        });
    });
});
