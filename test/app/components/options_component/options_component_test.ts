///<reference path="../../../../app/_typings.ts"/>

describe('OptionsComponent', () => {
    var config: BitbucketNotifier.Config,
        appUser,
        socketServer,
        pullRequestProgress,
        element: ng.IAugmentedJQuery,
        $rootScope: ng.IRootScopeService,
        $scope: ng.IScope,
        $compile: ng.ICompileService,
        growl: angular.growl.IGrowlService;

    beforeEach(module('bitbucketNotifier.options'));
    beforeEach(module('bitbucketNotifier.templates'));

    beforeEach(module([
        '$provide',
        ($provide: ng.auto.IProvideService) => {
            appUser = null;
            socketServer = null;
            pullRequestProgress = BitbucketNotifier.PullRequestProgress.PROPORTIONS;

            $provide.value('Config', {
                getUsername: jasmine.createSpy('Config.getUsername').and.callFake(() => {
                    return appUser;
                }),
                getSocketServerAddress: jasmine.createSpy('Config.getSocketServerAddress').and.callFake(() => {
                    return socketServer;
                }),
                getPullRequestProgress: jasmine.createSpy('Config.getPullRequestProgress').and.callFake(() => {
                    return pullRequestProgress;
                }),
                setUsername: jasmine.createSpy('Config.setUsername'),
                setSocketServerAddress: jasmine.createSpy('Config.setSocketServerAddress'),
                setPullRequestProgress: jasmine.createSpy('Config.setPullRequestProgress')
            });

            $provide.value('growl', {
                success: jasmine.createSpy('growl.success'),
                warning: jasmine.createSpy('growl.warning'),
                inlineMessages: jasmine.createSpy('growl.inlineMessages'),
                position: jasmine.createSpy('growl.position')
            });
        }
    ]));
    beforeEach(inject([
        'Config',
        '$rootScope',
        '$compile',
        'growl',
        (c, $r, $c, g) => {
            config = c;
            $rootScope = $r;
            $scope = $rootScope;
            $compile = $c;
            growl = g;
        }
    ]));

    it('should show empty form when configuration is empty', () => {
        element = $compile('<options></options>')($scope);
        $scope.$digest();

        var userElement = element.find('#app-user');
        var socketServerElement = element.find('#socket-server-address');
        var prProgressElement = element.find('input[name="pull-request-progress"]:checked');

        expect(userElement.val()).toEqual('');
        expect(socketServerElement.val()).toEqual('');
        expect(prProgressElement.val()).toEqual(BitbucketNotifier.PullRequestProgress.PROPORTIONS);
    });

    it('should show completed form if config is set', () => {
        appUser = 'john.smith';
        socketServer = 'http://localhost:1234';
        pullRequestProgress = BitbucketNotifier.PullRequestProgress.PERCENT;

        element = $compile('<options></options>')($scope);
        $scope.$digest();

        var userElement = element.find('#app-user');
        var socketServerElement = element.find('#socket-server-address');
        var prProgressElement = element.find('input[name="pull-request-progress"]:checked');

        expect(userElement.val()).toEqual(appUser);
        expect(socketServerElement.val()).toEqual(socketServer);
        expect(prProgressElement.val()).toEqual(pullRequestProgress);
    });

    it('should save config', () => {
        element = $compile('<options></options>')($scope);
        $scope.$digest();

        var username = 'aaaaa';
        var address = 'bbbbb';

        element.find('#app-user').val(username).trigger('input');
        element.find('#socket-server-address').val(address).trigger('input');
        element.find('input[name="pull-request-progress"][value="percent"]').click().triggerHandler('click');

        var saveButton = element.find('#submit');
        saveButton.triggerHandler('click');

        expect(config.setUsername).toHaveBeenCalledWith(username);
        expect(config.setSocketServerAddress).toHaveBeenCalledWith(address);
        expect(config.setPullRequestProgress).toHaveBeenCalledWith(BitbucketNotifier.PullRequestProgress.PERCENT);
    });

    it('should show growl message on save', () => {
        element = $compile('<options></options>')($scope);
        $scope.$digest();

        var username = 'aaaaa';
        var address = 'bbbbb';

        element.find('#app-user').val(username).trigger('input');
        element.find('#socket-server-address').val(address).trigger('input');

        var saveButton = element.find('#submit');
        saveButton.triggerHandler('click');

        expect(growl.success).toHaveBeenCalled();
    });

    it('should show warning that extension will soon reboot', () => {
        element = $compile('<options></options>')($scope);
        $scope.$digest();

        var username = 'aaaaa';
        var address = 'bbbbb';

        element.find('#app-user').val(username).trigger('input');
        element.find('#socket-server-address').val(address).trigger('input');

        var saveButton = element.find('#submit');
        saveButton.triggerHandler('click');

        expect(growl.warning).toHaveBeenCalled();
    });
});
