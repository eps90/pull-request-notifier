///<reference path="../../../../app/_typings.ts"/>

describe('PullRequestsListComponent', () => {
    beforeEach(module('bitbucketNotifier'));
    var element,
        $compile: ng.ICompileService,
        $scope: ng.IRootScopeService,
        pullRequests: Array<BitbucketNotifier.PullRequest> = [],
        localStorageService: angular.local.storage.ILocalStorageService,
        pullRequestRepository: BitbucketNotifier.PullRequestRepository;

    beforeEach(module('bitbucketNotifier'));
    beforeEach(module('bitbucketNotifier.templates'));

    beforeEach(
        inject([
            '$compile',
            '$rootScope',
            'localStorageService',
            'PullRequestRepository',
            ($c, $s, $l, $p) => {
                $compile = $c;
                $scope = $s;
                localStorageService = $l;
                pullRequestRepository = $p;
            }
        ])
    );

    beforeEach(() => {
        var loggedInUser:BitbucketNotifier.User = new BitbucketNotifier.User();
        loggedInUser.displayName = 'John Smith';
        loggedInUser.username = 'john.smith';

        var nonLoggedInUser:BitbucketNotifier.User = new BitbucketNotifier.User();
        nonLoggedInUser.displayName = 'Anna Kowalsky';
        nonLoggedInUser.username = 'anna.kowalsky';

        var loggedInReviewer:BitbucketNotifier.Reviewer = new BitbucketNotifier.Reviewer();
        loggedInReviewer.user = loggedInUser;
        loggedInReviewer.approved = true;

        var nonLoggedInReviewer:BitbucketNotifier.Reviewer = new BitbucketNotifier.Reviewer();
        nonLoggedInReviewer.user = nonLoggedInUser;
        nonLoggedInReviewer.approved = false;

        var project:BitbucketNotifier.Project = new BitbucketNotifier.Project();
        project.name = 'CRM';
        project.fullName = 'dacsoftware/crm';

        var authoredPullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();

        authoredPullRequest.id = 1;
        authoredPullRequest.title = 'This is a pull request';
        authoredPullRequest.author = loggedInUser;
        authoredPullRequest.reviewers.push(nonLoggedInReviewer);
        authoredPullRequest.targetRepository = project;
        authoredPullRequest.targetBranch = 'master';

        var assignedPullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
        assignedPullRequest.id = 2;
        assignedPullRequest.author = nonLoggedInUser;
        assignedPullRequest.title = 'This is another title';
        assignedPullRequest.reviewers = [loggedInReviewer, nonLoggedInReviewer];
        assignedPullRequest.targetRepository = project;
        assignedPullRequest.targetBranch = 'master';

        pullRequests = [authoredPullRequest, assignedPullRequest];

        pullRequestRepository.pullRequests = pullRequests;
    });

    describe('Authored mode', () => {
        beforeEach(() => {
            localStorageService.set(BitbucketNotifier.ConfigObject.USER, 'john.smith');
        });

        it('should render list of pull requests', () => {
            element = $compile('<pull-requests-list mode="\'AUTHORED\'"></pull-requests-list>')($scope);
            $scope.$digest();

            var childPullRequest = element.find('pull-request');

            expect(childPullRequest.length).toEqual(1);
            expect(childPullRequest.scope().mode).toEqual('AUTHORED');
        });

        it('should update pull requests list when pull requests repository changes', () => {
            element = $compile('<pull-requests-list mode="\'AUTHORED\'"></pull-requests-list>')($scope);
            $scope.$digest();

            var childPullRequest = element.find('pull-request');

            expect(childPullRequest.length).toEqual(1);

            var loggedInUser = new BitbucketNotifier.User();
            loggedInUser.username = 'john.smith';
            var newPullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
            newPullRequest.author = loggedInUser;

            pullRequestRepository.pullRequests.push(newPullRequest);
            $scope.$digest();

            childPullRequest = element.find('pull-request');
            expect(childPullRequest.length).toEqual(2);
        });
    });

    describe('Assigned mode', () => {
        beforeEach(() => {
            localStorageService.set(BitbucketNotifier.ConfigObject.USER, 'anna.kowalsky');
        });

        it('should render list of pull requests', () => {
            element = $compile('<pull-requests-list mode="\'ASSIGNED\'"></pull-requests-list>')($scope);
            $scope.$digest();

            var childPullRequest = element.find('pull-request');

            expect(childPullRequest.length).toEqual(2);
            expect(childPullRequest.scope().mode).toEqual('ASSIGNED');
        });

        it('should update pull requests list when pull requests repository changes', () => {
            element = $compile('<pull-requests-list mode="\'ASSIGNED\'"></pull-requests-list>')($scope);
            $scope.$digest();

            var childPullRequest = element.find('pull-request');

            expect(childPullRequest.length).toEqual(2);

            var loggedInUser = new BitbucketNotifier.User();
            loggedInUser.username = 'anna.kowalsky';
            var loggedInReviewer = new BitbucketNotifier.Reviewer();
            loggedInReviewer.user = loggedInUser;
            loggedInReviewer.approved = false;

            var newPullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
            newPullRequest.reviewers.push(loggedInReviewer);

            pullRequestRepository.pullRequests.push(newPullRequest);
            $scope.$digest();

            childPullRequest = element.find('pull-request');
            expect(childPullRequest.length).toEqual(3);
        });
    });
});
