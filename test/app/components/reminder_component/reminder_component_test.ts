///<reference path="../../../../app/_typings.ts"/>

describe('ReminderComponent', () => {
    var $scope: ng.IScope,
        $compile: ng.ICompileService,
        element: ng.IAugmentedJQuery;

    beforeEach(module('bitbucketNotifier'));
    beforeEach(module('bitbucketNotifier.templates'));

    beforeEach(() => {
        window['chrome'] = {
            extension: {
                sendMessage: jasmine.createSpy('chrome.extension.sendMessage')
            }
        };
    });

    beforeEach(inject([
        '$rootScope',
        '$compile',
        ($r: ng.IRootScopeService, $c) => {
            $scope = $r.$new();
            $compile = $c;
        }
    ]));

    it('should show reminder icon', () => {
        element = $compile('<reminder></reminder>')($scope);
        $scope.$digest();

        var remindLink = element.find('a.remind-link');
        expect(remindLink.length).toEqual(1);
        expect(remindLink.find('i').first().hasClass('fa-bell')).toBeTruthy();
    });
});
