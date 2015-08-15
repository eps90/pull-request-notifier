///<reference path="../../../app/_typings.ts"/>

fdescribe('Notifier', () => {
    var notifier: BitbucketNotifier.Notifier;

    beforeEach(module('bitbucketNotifier'));
    beforeEach(() => {
        window['chrome'] = {notifications: {create: () => {}}};
    });
    beforeEach(inject([
        'Notifier',
        (n) => {
            notifier = n;
        }
    ]));

    it('should create notificaion via Chrome API', () => {
        spyOn(window['chrome'].notifications, 'create');
        var notificationOptions = {
            title: 'Test title'
        };
        notifier.notify(notificationOptions);
        expect(window['chrome'].notifications.create).toHaveBeenCalledWith(notificationOptions);
    });
});
