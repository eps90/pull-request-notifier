export interface ModelInterface {}

export class Project implements ModelInterface {
    name: string = '';
    fullName: string = '';

    static deslugify(slug: string): string {
        return slug.replace(/__/g, '/');
    }

    slugify(): string {
        return this.fullName.replace(/\//g, '__');
    }
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

export class PullRequestLinks implements ModelInterface{
    self: string = '';
    html: string = '';
}

export class PullRequest implements ModelInterface {
    id: number;
    title: string = '';
    description: string = '';
    author: User = new User();
    targetRepository: Project = new Project();
    targetBranch: string = '';
    reviewers: Array<Reviewer> = [];
    state: PullRequestState;
    links: PullRequestLinks = new PullRequestLinks();

    equals(otherPr: PullRequest): boolean {
        return otherPr.id === this.id
            && otherPr.targetRepository.fullName === this.targetRepository.fullName;
    }

    getReviewersList(): string[] {
        return _.map(this.reviewers, (reviewer: Reviewer) => {
            return reviewer.user.username;
        });
    }

    isMergeReady(): boolean {
        return _.filter(this.reviewers, (reviewer: Reviewer) => {
            return !reviewer.approved;
        }).length === 0;
    }
}

export interface ICommentConent {
    raw?: string;
    html?: string;
    markup?: string;
}

export interface ILink {
    href: string;
}

export interface ICommentLinks {
    self?: ILink;
    html?: ILink;
}

export class Comment implements ModelInterface {
    id: number;
    content: ICommentConent;
    links: ICommentLinks;
}

export class PullRequestEvent implements ModelInterface {
    actor: User = new User();
    sourceEvent: string = '';
    pullRequests: Array<PullRequest> = [];
    context: PullRequest = new PullRequest();
}

export class PullRequestCommentEvent implements ModelInterface {
    actor: User = new User();
    pullRequest: PullRequest = new PullRequest();
    comment: Comment = new Comment();
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
    static REMIND: string = 'client:remind';
}

export class SocketServerEvent {
    static PULLREQUESTS_UPDATED: string = 'server:pullrequests:updated';
    static PULLREQUEST_UPDATED: string = 'server:pullrequest:updated';
    static INTRODUCED: string = 'server:introduced';
    static REMIND: string = 'server:remind';
    static NEW_COMMENT: string = 'server:comments:new';
    static NEW_REPLY_FOR_COMMENT: 'server:comments:reply';
}

export class ChromeExtensionEvent {
    static UPDATE_PULLREQUESTS: string = 'backend:update_pullrequests';
    static REMIND: string = 'backend:remind';

    type: string = '';
    content: any;

    constructor(type: string, content: any = {}) {
        this.type = type;
        this.content = content;
    }

    static isBackground(): boolean {
        return window.location.href.match(/background\.html/) !== null;
    }
}

export class ConfigObject {
    static USER: string = 'app:user';
    static SOCKET_SERVER: string = 'app:socket_server';
    static PULLREQUEST_PROGRESS: string = 'app:pullrequest_progress';
}

export interface Notification {
    notificationId: string;
}

export class PullRequestNotification implements Notification {
    notificationId: string = '';
    pullRequestHtmlLink: string = '';
}

export class PullRequestProgress {
    static PROPORTIONS: string = 'proportions';
    static PERCENT: string = 'percent';
    static PROGRESS_BAR: string = 'progress_bar';
}

export class Sound {
    static NEW_PULLREQUEST: string = 'sounds.new_pull_request';
    static APPROVED_PULLREQUEST: string = 'sounds.approved_pull_request';
    static MERGED_PULLREQUEST: string = 'sounds.merged_pull_request';
    static REMINDER: string = 'sounds.reminder';

    constructor(public path: string, public label: string) {}
}
