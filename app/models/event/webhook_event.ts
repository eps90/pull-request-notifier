export class WebhookEvent {
    public static PULLREQUEST_CREATED: string = 'webhook:pullrequest:created';
    public static PULLREQUEST_UPDATED: string = 'webhook:pullrequest:updated';
    public static PULLREQUEST_APPROVED: string = 'webhook:pullrequest:approved';
    public static PULLREQUEST_UNAPPROVED: string = 'webhook:pullrequest:unapproved';
    public static PULLREQUEST_FULFILLED: string = 'webhook:pullrequest:fulfilled';
    public static PULLREQUEST_REJECTED: string = 'webhook:pullrequest:rejected';
}
