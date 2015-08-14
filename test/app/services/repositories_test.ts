///<reference path="../../../app/_typings.ts"/>

describe('Repositories', () => {
    var pullRequestRepositoryOne: BitbucketNotifier.PullRequestRepository,
        pullRequestRepositoryTwo: BitbucketNotifier.PullRequestRepository;
    beforeEach(module('bitbucketNotifier'));
    beforeEach(inject([
        'PullRequestRepository',
        'PullRequestRepository',
        ($s1, $s2) => {
            pullRequestRepositoryOne = $s1;
            pullRequestRepositoryTwo = $s2;
        }
    ]));

    it('should keep the same value each time', () => {
        var pullRequestOne: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
        var pullRequestTwo: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();

        pullRequestRepositoryOne.pullRequests = [pullRequestOne];
        pullRequestRepositoryTwo.pullRequests.push(pullRequestTwo);

        expect(pullRequestRepositoryOne.pullRequests === pullRequestRepositoryTwo.pullRequests);
    });
});
