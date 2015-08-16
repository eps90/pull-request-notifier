///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    export interface ModelInterface {}

    export class Project implements ModelInterface {
        name: string;
        fullName: string;
        pullRequestsUrl: string;
    }

    export class User implements ModelInterface {
        username: string;
        displayName: string;
    }

    export class Reviewer implements ModelInterface {
        approved: boolean;
        user: User;
    }

    export enum PullRequestState {Open, Merged, Declined}

    export class PullRequest implements ModelInterface {
        id: number;
        title: string;
        description: string;
        author: User;
        targetRepository: Project;
        targetBranch: string;
        reviewers: Array<Reviewer> = [];
        state: PullRequestState;
        selfLink: string;
    }

    export class PullRequestEvent implements ModelInterface {
        actor: User;
        sourceEvent: string;
        pullRequests: Array<PullRequest>;
        context: PullRequest
    }

    export class WebhookEvent {
        static PULLREQUEST_CREATED = 'webhook:pullrequest:created';
        static PULLREQUEST_UPDATED = 'webhook:pullrequest:updated';
        static PULLREQUEST_APPROVED = 'webhook:pullrequest:approved';
        static PULLREQUEST_UNAPPROVED = 'webhook:pullrequest:unapproved';
        static PULLREQUEST_FULFILLED = 'webhook:pullrequest:fulfilled';
        static PULLREQUEST_REJECTED = 'webhook:pullrequest:rejected';
    }

    export class SocketClientEvent {
        static INTRODUCE = 'client:introduce';
    }

    export class SocketServerEvent {
        static PULLREQUESTS_UPDATED = 'server:pullrequests:updated';
    }

    export class ConfigObject {
        static USER = 'app:user';
    }
}
