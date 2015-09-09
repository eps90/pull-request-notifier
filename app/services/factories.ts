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
                    var targetReviewer = new Reviewer();
                    var currentReviewer = rawObject.reviewers[ridx];
                    if (currentReviewer.hasOwnProperty('approved')) {
                        targetReviewer.approved = currentReviewer.approved;
                    }

                    if (currentReviewer.hasOwnProperty('user')) {
                        targetReviewer.user = UserFactory.create(currentReviewer.user);
                    }

                    pullRequest.reviewers.push(targetReviewer);
                }
            }

            if (rawObject.hasOwnProperty('links')) {
                if (rawObject.links.hasOwnProperty('self')) {
                    pullRequest.links.self = rawObject.links.self;
                }

                if (rawObject.links.hasOwnProperty('html')) {
                    pullRequest.links.html = rawObject.links.html;
                }
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
}
