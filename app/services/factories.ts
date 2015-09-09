///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    export class UserFactory {
        static create(rawObject: any): User {
            var user = new User();
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
        static create(rawObject: any): Project {
            var project = new Project();
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
        static create(rawObject): Reviewer {
            var reviewer = new Reviewer();
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
        static create(rawObject: any): PullRequestLinks {
            var links = new PullRequestLinks();

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
        static create(rawObject: any): PullRequest {
            var pullRequest = new PullRequest();
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
                for (var ridx = 0, rlen = rawObject.reviewers.length; ridx < rlen; ridx++) {
                    pullRequest.reviewers.push(ReviewerFactory.create(rawObject.reviewers[ridx]));
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
                }
            }

            return pullRequest;
        }
    }

    export class PullRequestEventFactory {
        static create(rawObject: any): PullRequestEvent {
            var event = new PullRequestEvent();
            if (rawObject.hasOwnProperty('actor')) {
                event.actor = UserFactory.create(rawObject.actor);
            }

            if (rawObject.hasOwnProperty('sourceEvent')) {
                event.sourceEvent = rawObject.sourceEvent;
            }

            if (rawObject.hasOwnProperty('pullRequests')) {
                event.pullRequests = [];
                for (var prIdx = 0, prLen = rawObject.pullRequests.length; prIdx < prLen; prIdx++) {
                    var currentPr = rawObject.pullRequests[prIdx];
                    event.pullRequests.push(PullRequestFactory.create(currentPr));
                }
            }

            if (rawObject.hasOwnProperty('context')) {
                event.context = PullRequestFactory.create(rawObject.context);
            }

            return event;
        }
    }
}
