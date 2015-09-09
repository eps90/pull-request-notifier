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

    it('should call chrome.extension.sendMessage on click', () => {
        var pullRequest = new BitbucketNotifier.PullRequest();
        $scope['myPr'] = pullRequest;

        element = $compile('<reminder pull-request="myPr"></reminder>')($scope);
        $scope.$digest();

        var linkElement = element.find('a');
        linkElement.triggerHandler('click');

        expect(window['chrome'].extension.sendMessage).toHaveBeenCalledWith(
            new BitbucketNotifier.ChromeExtensionEvent(
                BitbucketNotifier.ChromeExtensionEvent.REMIND,
                pullRequest
            )
        );
    });

    it('should lock reminder link on click', () => {
        element = $compile('<reminder></reminder>')($scope);
        $scope.$digest();

        expect(element.isolateScope()['disabled']).toBeFalsy();
        var linkElement = element.find('a');
        linkElement.triggerHandler('click');

        expect(element.isolateScope()['disabled']).toBeTruthy();
    });

    it('should change reminder icon on click', () => {
        element = $compile('<reminder></reminder>')($scope);
        $scope.$digest();

        // Make sure that only one icon is shown at time
        expect(element.find('a i.fa-check').length).toEqual(0);

        var linkElement = element.find('a');
        linkElement.triggerHandler('click');

        linkElement = element.find('a');
        expect(linkElement.find('i').hasClass('fa-check')).toBeTruthy();
    })
});
