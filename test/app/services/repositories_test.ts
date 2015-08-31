///<reference path="../../../app/_typings.ts"/>

describe('Repositories', () => {
    describe('PullRequestRepository', () => {
        var pullRequestRepositoryOne: BitbucketNotifier.PullRequestRepository,
            pullRequestRepositoryTwo: BitbucketNotifier.PullRequestRepository,
            messageFunc, connectionFunc, connectPort, connectPortFn;

        beforeEach(() => {
            connectPort = {
                onMessage: {
                    addListener: jasmine.createSpy('port.onMessage.addListener').and.callFake((fn) => {
                        connectPortFn = fn;
                    })
                }
            };
            window['chrome'] = {
                extension: {
                    connect: jasmine.createSpy('chrome.extension.connect').and.returnValue(connectPort),
                    sendMessage: jasmine.createSpy('chrome.extension.sendMessage'),
                    onMessage: {
                        addListener: jasmine.createSpy('chrome.extension.onMessage.addListener').and.callFake((fn) => {
                            messageFunc = fn;
                        })
                    },
                    onConnect: {
                        addListener: jasmine.createSpy('chrome.extension.onConnect.addListener').and.callFake((fn) => {
                            connectionFunc = fn;
                        })
                    }
                }
            };
        });
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

        it('should set the list of pull requests', () => {
            expect(pullRequestRepositoryOne.pullRequests.length).toBe(0);

            var pullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
            var pullRequestsList = [pullRequest];

            pullRequestRepositoryOne.setPullRequests(pullRequestsList);

            expect(pullRequestRepositoryOne.pullRequests.length).toBe(1);
        });

        describe('with chrome events', () => {
            it('should emit chrome event on pull request collection change', () => {
                var pullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
                var pullRequestsList = [pullRequest];

                pullRequestRepositoryOne.setPullRequests(pullRequestsList);
                expect(window['chrome'].extension.sendMessage)
                    .toHaveBeenCalledWith({type: BitbucketNotifier.ChromeExtensionEvent.UPDATE_PULLREQUESTS, content: pullRequestsList});
            });

            it('should listen to event to update pull requests', () => {
                var pullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
                var pullRequestsList = [pullRequest];

                expect(pullRequestRepositoryOne.pullRequests.length).toBe(0);
                messageFunc({type: BitbucketNotifier.ChromeExtensionEvent.UPDATE_PULLREQUESTS, content: pullRequestsList});
                expect(pullRequestRepositoryOne.pullRequests.length).toBe(1);
            });

            it('should send all pull requests on connection', () => {
                var pullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
                pullRequestRepositoryOne.pullRequests = [pullRequest];

                var port = {
                    postMessage: jasmine.createSpy('port.postMessage')
                };
                connectionFunc(port);
                expect(port.postMessage).toHaveBeenCalledWith([pullRequest]);
            });

            it('should receive all pull requests on connection', () => {
                var pullRequest: BitbucketNotifier.PullRequest = new BitbucketNotifier.PullRequest();
                var pullRequestsList = [pullRequest];

                expect(pullRequestRepositoryOne.pullRequests.length).toBe(0);
                connectPortFn(pullRequestsList);
                expect(pullRequestRepositoryOne.pullRequests.length).toBe(1);
            });
        });
    });

    describe('NotificationRepository', () => {
        var notificationRepository: BitbucketNotifier.NotificationRepository;

        beforeEach(module('bitbucketNotifier.background'));
        beforeEach(inject([
            'NotificationRepository',
            (n) => {
                notificationRepository = n;
            }
        ]));

        it('should add notification to repository', () => {
            var notificationId = 'aaaa';
            var prLink = 'http://example.com';

            notificationRepository.add(notificationId, prLink);
            expect(notificationRepository.getAll().length).toEqual(1);
        });

        it('should find single notification', () => {
            var notificationId = 'abcd';
            var prLink = 'http://example.com';

            notificationRepository.add(notificationId, prLink);
            var actualNotification = <BitbucketNotifier.PullRequestNotification> notificationRepository.find(notificationId);

            expect(actualNotification.pullRequestHtmlLink).toEqual('http://example.com');
        });
    });
});
