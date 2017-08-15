import * as _ from 'lodash';

export class Project {
    public name: string = '';
    public fullName: string = '';

    public static deslugify(slug: string): string {
        return slug.replace(/__/g, '/');
    }

    public slugify(): string {
        return this.fullName.replace(/\//g, '__');
    }
}

export class User {
    public username: string = '';
    public displayName: string = '';
}

export class Reviewer {
    public approved: boolean;
    public user: User = new User();
}

export enum PullRequestState {Open, Merged, Declined}

export class PullRequestLinks {
    public self: string = '';
    public html: string = '';
}

export class PullRequest {
    public id: number;
    public title: string = '';
    public description: string = '';
    public author: User = new User();
    public targetRepository: Project = new Project();
    public targetBranch: string = '';
    public reviewers: Reviewer[] = [];
    public state: PullRequestState;
    public links: PullRequestLinks = new PullRequestLinks();

    public equals(otherPr: PullRequest): boolean {
        return otherPr.id === this.id
            && otherPr.targetRepository.fullName === this.targetRepository.fullName;
    }

    public getReviewersList(): string[] {
        return _.map(this.reviewers, (reviewer: Reviewer) => {
            return reviewer.user.username;
        });
    }

    public isMergeReady(): boolean {
        return _.filter(this.reviewers, (reviewer: Reviewer) => {
            return !reviewer.approved;
        }).length === 0;
    }
}

export interface CommentContentInterface {
    raw?: string;
    html?: string;
    markup?: string;
}

export interface LinkInterface {
    href: string;
}

export interface CommentLinksInterface {
    self?: LinkInterface;
    html?: LinkInterface;
}

export class Comment {
    public id: number;
    public content: CommentContentInterface;
    public links: CommentLinksInterface;
}

export class PullRequestEvent {
    public actor: User = new User();
    public sourceEvent: string = '';
    public pullRequests: PullRequest[] = [];
    public context: PullRequest = new PullRequest();
}

export class PullRequestCommentEvent {
    public actor: User = new User();
    public pullRequest: PullRequest = new PullRequest();
    public comment: Comment = new Comment();
}

export class WebhookEvent {
    public static PULLREQUEST_CREATED: string = 'webhook:pullrequest:created';
    public static PULLREQUEST_UPDATED: string = 'webhook:pullrequest:updated';
    public static PULLREQUEST_APPROVED: string = 'webhook:pullrequest:approved';
    public static PULLREQUEST_UNAPPROVED: string = 'webhook:pullrequest:unapproved';
    public static PULLREQUEST_FULFILLED: string = 'webhook:pullrequest:fulfilled';
    public static PULLREQUEST_REJECTED: string = 'webhook:pullrequest:rejected';
}

export class SocketClientEvent {
    public static INTRODUCE: string = 'client:introduce';
    public static REMIND: string = 'client:remind';
}

export class SocketServerEvent {
    public static PULLREQUESTS_UPDATED: string = 'server:pullrequests:updated';
    public static PULLREQUEST_UPDATED: string = 'server:pullrequest:updated';
    public static INTRODUCED: string = 'server:introduced';
    public static REMIND: string = 'server:remind';
    public static NEW_COMMENT: string = 'server:comments:new';
    public static NEW_REPLY_FOR_COMMENT: 'server:comments:reply';
}

export class ChromeExtensionEvent {
    public type: string = '';
    public content: any;

    public static UPDATE_PULLREQUESTS: string = 'backend:update_pullrequests';
    public static REMIND: string = 'backend:remind';

    constructor(type: string, content: any = {}) {
        this.type = type;
        this.content = content;
    }

    public static isBackground(): boolean {
        return window.location.href.match(/background\.html/) !== null;
    }
}

export class ConfigObject {
    public static USER: string = 'app:user';
    public static SOCKET_SERVER: string = 'app:socket_server';
    public static PULLREQUEST_PROGRESS: string = 'app:pullrequest_progress';
}

export interface Notification {
    notificationId: string;
}

export class PullRequestNotification implements Notification {
    public notificationId: string = '';
    public pullRequestHtmlLink: string = '';
}

export class PullRequestProgress {
    public static PROPORTIONS: string = 'proportions';
    public static PERCENT: string = 'percent';
    public static PROGRESS_BAR: string = 'progress_bar';
}

export class NotificationSound {
    public static NEW_PULLREQUEST: string = 'sounds.new_pull_request';
    public static APPROVED_PULLREQUEST: string = 'sounds.approved_pull_request';
    public static MERGED_PULLREQUEST: string = 'sounds.merged_pull_request';
    public static REMINDER: string = 'sounds.reminder';
}

export class Sound {
    constructor(private _id: string, private _soundPath: string, private _label: string) {}

    get id(): string {
        return this._id;
    }

    get soundPath(): string {
        return this._soundPath;
    }

    get label(): string {
        return this._label;
    }
}
