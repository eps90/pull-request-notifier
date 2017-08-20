import {Howl} from 'howler';
import {User} from '../models/user';
import {Project} from '../models/project';
import {Reviewer} from '../models/reviewer';
import {PullRequestLinks} from '../models/pull_request_links';
import {PullRequest} from '../models/pull_request';
import {PullRequestState} from '../models/pull_request_state';
import {PullRequestEvent} from '../models/event/pull_request_event';

export class UserFactory {
    public static create(rawObject: any): User {
        const user = new User();
        if (rawObject.hasOwnProperty('username')) {
            user.username = rawObject.username;
        }
        if (rawObject.hasOwnProperty('displayName')) {
            user.displayName = rawObject.displayName;
        }

        return user;
    }
}

export class ProjectFactory {
    public static create(rawObject: any): Project {
        const project = new Project();
        if (rawObject.hasOwnProperty('name')) {
            project.name = rawObject.name;
        }
        if (rawObject.hasOwnProperty('fullName')) {
            project.fullName = rawObject.fullName;
        }

        return project;
    }
}

export class ReviewerFactory {
    public static create(rawObject): Reviewer {
        const reviewer = new Reviewer();
        if (rawObject.hasOwnProperty('user')) {
            reviewer.user = UserFactory.create(rawObject.user);
        }

        if (rawObject.hasOwnProperty('approved')) {
            reviewer.approved = rawObject.approved;
        }

        return reviewer;
    }
}

export class PullRequestLinksFactory {
    public static create(rawObject: any): PullRequestLinks {
        const links = new PullRequestLinks();

        if (rawObject.hasOwnProperty('self')) {
            links.self = rawObject.self;
        }

        if (rawObject.hasOwnProperty('html')) {
            links.html = rawObject.html;
        }

        return links;
    }
}

export class PullRequestFactory {
    public static create(rawObject: any): PullRequest {
        const pullRequest = new PullRequest();
        if (rawObject.hasOwnProperty('id')) {
            pullRequest.id = rawObject.id;
        }

        if (rawObject.hasOwnProperty('title')) {
            pullRequest.title = rawObject.title;
        }

        if (rawObject.hasOwnProperty('description')) {
            pullRequest.description = rawObject.description;
        }

        if (rawObject.hasOwnProperty('targetBranch')) {
            pullRequest.targetBranch = rawObject.targetBranch;
        }

        if (rawObject.hasOwnProperty('author')) {
            pullRequest.author = UserFactory.create(rawObject.author);
        }

        if (rawObject.hasOwnProperty('targetRepository')) {
            pullRequest.targetRepository = ProjectFactory.create(rawObject.targetRepository);
        }

        if (rawObject.hasOwnProperty('reviewers') && Array.isArray(rawObject.reviewers)) {
            pullRequest.reviewers = [];
            for (const reviewer of rawObject.reviewers) {
                pullRequest.reviewers.push(ReviewerFactory.create(reviewer));
            }
        }

        if (rawObject.hasOwnProperty('links')) {
            pullRequest.links = PullRequestLinksFactory.create(rawObject.links);
        }

        if (rawObject.hasOwnProperty('state')) {
            switch (rawObject.state) {
                case 0:
                    pullRequest.state = PullRequestState.Open;
                    break;
                case 1:
                    pullRequest.state = PullRequestState.Merged;
                    break;
                case 2:
                    pullRequest.state = PullRequestState.Declined;
                    break;
                default:
                    break;
            }
        }

        return pullRequest;
    }

    public static createFromArray(pullRequests: any[]): PullRequest[] {
        const result = [];
        for (const pullRequest of pullRequests) {
            result.push(this.create(pullRequest));
        }

        return result;
    }
}

export class PullRequestEventFactory {
    public static create(rawObject: any): PullRequestEvent {
        const event = new PullRequestEvent();
        if (rawObject.hasOwnProperty('actor')) {
            event.actor = UserFactory.create(rawObject.actor);
        }

        if (rawObject.hasOwnProperty('sourceEvent')) {
            event.sourceEvent = rawObject.sourceEvent;
        }

        if (rawObject.hasOwnProperty('pullRequests')) {
            event.pullRequests = [];
            for (const currentPr of rawObject.pullRequests) {
                event.pullRequests.push(PullRequestFactory.create(currentPr));
            }
        }

        if (rawObject.hasOwnProperty('context')) {
            event.context = PullRequestFactory.create(rawObject.context);
        }

        return event;
    }
}

export class HowlSoundFactory {
    public static createSound(soundPath: string): Howl {
        return new Howl({
            src: [soundPath]
        });
    }
}
