import {Indicator} from '../../../app/services/indicator';
import * as angular from 'angular';

describe('Indicator', () => {
    let indicator: Indicator;

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
        const defaultBadgeText = '?';
        expect(window['chrome'].browserAction.setBadgeText).toHaveBeenCalledWith({text: defaultBadgeText});
    });

    it('should be able to set badge text', () => {
        const badgeText = '1234';
        indicator.setText(badgeText);
        expect(window['chrome'].browserAction.setBadgeText).toHaveBeenCalledWith({text: badgeText});
    });

    it('should be able to set default by resetting', () => {
        window['chrome'].browserAction.setBadgeText.calls.reset();
        indicator.reset();
        expect(window['chrome'].browserAction.setBadgeText).toHaveBeenCalledWith({text: '?'});
    });
});
