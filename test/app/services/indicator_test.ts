///<reference path="../../../app/_typings.ts"/>

describe('Indicator', () => {
    var indicator: BitbucketNotifier.Indicator;

    beforeEach(() => {
        window['chrome'] = {
            browserAction: {
                setBadgeText: jasmine.createSpy('chrome.browserAction.setBadgeText')
            }
        };
    });
    beforeEach(angular.mock.module('bitbucketNotifier.background'));
    beforeEach(inject([
        'Indicator',
        (i) => {
            indicator = i;
        }
    ]));

    it('should set up default text on badge', () => {
        var defaultBadgeText = '?';
        expect(window['chrome'].browserAction.setBadgeText).toHaveBeenCalledWith({text: defaultBadgeText});
    });

    it('should be able to set badge text', () => {
        var badgeText = '1234';
        indicator.setText(badgeText);
        expect(window['chrome'].browserAction.setBadgeText).toHaveBeenCalledWith({text: badgeText});
    });

    it('should be able to set default by resetting', () => {
        window['chrome'].browserAction.setBadgeText.calls.reset();
        indicator.reset();
        expect(window['chrome'].browserAction.setBadgeText).toHaveBeenCalledWith({text: '?'});
    });
});
