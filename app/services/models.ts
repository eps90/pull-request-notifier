///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    'use strict';

    export interface ModelInterface {}

    export class Project implements ModelInterface {
        name: string = '';
        fullName: string = '';
    }

    export class User implements ModelInterface {
        username: string = '';
        displayName: string = '';
    }

    export class Reviewer implements ModelInterface {
        approved: boolean;
        user: User = new User();
    }

    export enum PullRequestState {Open, Merged, Declined}

    export class PullRequest implements ModelInterface {
        id: number;
        title: string = '';
        description: string = '';
        author: User = new User();
        targetRepository: Project = new Project();
        targetBranch: string = '';
        reviewers: Array<Reviewer> = [];
        state: PullRequestState;
    }

    export class PullRequestEvent implements ModelInterface {
        actor: User = new User();
        sourceEvent: string = '';
        pullRequests: Array<PullRequest> = [];
        context: PullRequest = new PullRequest();
    }

    export class WebhookEvent {
        static PULLREQUEST_CREATED: string = 'webhook:pullrequest:created';
        static PULLREQUEST_UPDATED: string = 'webhook:pullrequest:updated';
        static PULLREQUEST_APPROVED: string = 'webhook:pullrequest:approved';
        static PULLREQUEST_UNAPPROVED: string = 'webhook:pullrequest:unapproved';
        static PULLREQUEST_FULFILLED: string = 'webhook:pullrequest:fulfilled';
        static PULLREQUEST_REJECTED: string = 'webhook:pullrequest:rejected';
    }

    export class SocketClientEvent {
        static INTRODUCE: string = 'client:introduce';
    }

    export class SocketServerEvent {
        static PULLREQUESTS_UPDATED: string = 'server:pullrequests:updated';
        static INTRODUCED: string = 'server:introduced';
    }

    export class ChromeExtensionEvent {
        static UPDATE_PULLREQUESTS: string = 'backend:update_pullrequests';
        static PULLREQUESTS_UPDATED: string = 'app:pullrequests_updated';
    }

    export class ConfigObject {
        static USER: string = 'app:user';
        static SOCKET_SERVER: string = 'app:socket_server';
    }
}
