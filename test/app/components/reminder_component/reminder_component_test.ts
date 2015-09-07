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
});
