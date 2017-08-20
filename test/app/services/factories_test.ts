import {Howl} from 'howler';
import {User} from '../../../app/models/user';
import {PullRequestState} from '../../../app/models/pull_request_state';
import {UserFactory} from '../../../app/services/factory/user_factory';
import {ProjectFactory} from '../../../app/services/factory/project_factory';
import {ReviewerFactory} from '../../../app/services/factory/reviewer_factory';
import {PullRequestLinksFactory} from '../../../app/services/factory/pull_request_links_factory';
import {PullRequestFactory} from '../../../app/services/factory/pull_request_factory';
import {PullRequestEventFactory} from '../../../app/services/factory/pull_request_event_factory';
import {HowlSoundFactory} from '../../../app/services/factory/howl_sound_factory';

describe('Factories', () => {
    describe('UserFactory', () => {
        it('should create User object from raw object', () => {
            const rawObject = {
                displayName: 'John Kowalsky',
                username: 'john.kowalsky'
            };

            const user: User = UserFactory.create(rawObject);
            expect(user.displayName).toEqual('John Kowalsky');
            expect(user.username).toEqual('john.kowalsky');
        });
    });

    describe('ProjectFactory', () => {
        it('should create Project object from raw object', () => {
            const rawObject = {
                name: 'Awesome project',
                fullName: 'team_name/repo_name'
            };

            const project = ProjectFactory.create(rawObject);
            expect(project.fullName).toEqual('team_name/repo_name');
            expect(project.name).toEqual('Awesome project');
        });
    });

    describe('ReviewerFactory', () => {
        it('should create a Reviewer object from raw object', () => {
            const rawObject = {
                user: {
                    username: 'john.kowalsky',
                    displayName: 'John Kowalsky'
                },
                approved: true
            };

            const reviewer = ReviewerFactory.create(rawObject);
            expect(reviewer.user.username).toEqual('john.kowalsky');
            expect(reviewer.user.displayName).toEqual('John Kowalsky');
            expect(reviewer.approved).toEqual(true);
        });
    });

    describe('PullRequestLinksFactory', () => {
        it('should create PullRequestLinks object from raw object', () => {
            const rawObject = {
                self: 'http://example.com/self',
                html: 'http://example.com/html'
            };

            const links = PullRequestLinksFactory.create(rawObject);
            expect(links.self).toEqual('http://example.com/self');
            expect(links.html).toEqual('http://example.com/html');
        });
    });

    describe('PullRequestFactory', () => {
        it('should create a PullRequest model object from raw object', () => {
            const rawObject = {
                id: 1,
                title: 'This is a title',
                description: 'This is a description',
                author: {
                    username: 'john.kowalsky',
                    displayName: 'John Kowalsky'
                },
                targetRepository: {
                    name: 'Awesome project',
                    fullName: 'dacsoftware/awesome_project'
                },
                targetBranch: 'master',
                reviewers: [
                    {
                        user: {
                            username: 'anna.smith',
                            displayName: 'Anna Smith'
                        },
                        approved: true
                    }
                ],
                state: 0,
                links: {
                    self: 'http://example.com/self',
                    html: 'http://example.com/html'
                }
            };

            const pullRequest = PullRequestFactory.create(rawObject);
            expect(pullRequest.id).toEqual(1);
            expect(pullRequest.title).toEqual('This is a title');
            expect(pullRequest.description).toEqual('This is a description');
            expect(pullRequest.author.username).toEqual('john.kowalsky');
            expect(pullRequest.author.displayName).toEqual('John Kowalsky');
            expect(pullRequest.targetRepository.name).toEqual('Awesome project');
            expect(pullRequest.targetRepository.fullName).toEqual('dacsoftware/awesome_project');
            expect(pullRequest.targetBranch).toEqual('master');
            expect(pullRequest.reviewers.length).toEqual(1);
            expect(pullRequest.reviewers[0].user.username).toEqual('anna.smith');
            expect(pullRequest.reviewers[0].user.displayName).toEqual('Anna Smith');
            expect(pullRequest.reviewers[0].approved).toEqual(true);
            expect(pullRequest.state).toBe(PullRequestState.Open);
            expect(pullRequest.links.self).toEqual('http://example.com/self');
            expect(pullRequest.links.html).toEqual('http://example.com/html');
        });

        it('should create collection of PullRequest from raw array of objects', () => {
            const pullRequests = [
                {
                    id: 1,
                    title: 'This is a title',
                    description: 'This is a description'
                },
                {
                    id: 2,
                    title: 'Another title',
                    description: 'Another description'
                }
            ];

            const actual = PullRequestFactory.createFromArray(pullRequests);

            expect(actual.length).toEqual(2);
            expect(actual[0].id).toEqual(1);
            expect(actual[0].title).toEqual('This is a title');
            expect(actual[0].description).toEqual('This is a description');
            expect(actual[1].id).toEqual(2);
            expect(actual[1].title).toEqual('Another title');
            expect(actual[1].description).toEqual('Another description');
        });
    });

    describe('PullRequestEventFactory', () => {
        it('should create a PullRequestEvent object from raw object', () => {
            const rawObject = {
                actor: {
                    username: 'john.kowalsky',
                    displayName: 'John Kowalsky'
                },
                sourceEvent: 'webhook:pullrequest:updated',
                pullRequests: [
                    {
                        id: 1,
                        title: 'This is some title'
                    }
                ],
                context: {
                    id: 2,
                    title: 'This is another title'
                }
            };

            const event = PullRequestEventFactory.create(rawObject);
            expect(event.actor.username).toEqual('john.kowalsky');
            expect(event.actor.displayName).toEqual('John Kowalsky');
            expect(event.sourceEvent).toEqual('webhook:pullrequest:updated');
            expect(event.pullRequests.length).toBe(1);
            expect(event.pullRequests[0].id).toEqual(1);
            expect(event.pullRequests[0].title).toEqual('This is some title');
            expect(event.context.id).toEqual(2);
            expect(event.context.title).toEqual('This is another title');
        });
    });

    describe('Sound factory', () => {
        it('should create Howl object with given sound path', () => {
            const soundPath = '/some/sound/path.mp3';
            const createdObject = HowlSoundFactory.createSound(soundPath);

            expect(createdObject as any instanceof Howl).toBeTruthy();
        });
    });
});
