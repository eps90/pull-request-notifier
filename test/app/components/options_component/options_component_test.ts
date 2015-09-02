///<reference path="../../../../app/_typings.ts"/>

describe('OptionsComponent', () => {
    var config: BitbucketNotifier.Config,
        appUser,
        socketServer,
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

            $provide.value('Config', {
                getUsername: jasmine.createSpy('Config.getUsername').and.callFake(() => {
                    return appUser;
                }),
                getSocketServerAddress: jasmine.createSpy('Config.getSocketServerAddress').and.callFake(() => {
                    return socketServer;
                }),
                setUsername: jasmine.createSpy('Config.setUsername'),
                setSocketServerAddress: jasmine.createSpy('Config.setSocketServerAddress')
            });

            $provide.value('growl', {
                success: jasmine.createSpy('growl.success'),
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

    it('should have title', () => {
        element = $compile('<options></options>')($scope);
        $scope.$digest();

        var title = element.find('h2.title');

        expect(title.text()).toContain('Options');
    });

    it('should show empty form when configuration is empty', () => {
        element = $compile('<options></options>')($scope);
        $scope.$digest();

        var userElement = element.find('#app-user');
        var socketServerElement = element.find('#socket-server-address');

        expect(userElement.val()).toEqual('');
        expect(socketServerElement.val()).toEqual('');
    });

    it('should show completed form if config is set', () => {
        appUser = 'john.smith';
        socketServer = 'http://localhost:1234';

        element = $compile('<options></options>')($scope);
        $scope.$digest();

        var userElement = element.find('#app-user');
        var socketServerElement = element.find('#socket-server-address');

        expect(userElement.val()).toEqual(appUser);
        expect(socketServerElement.val()).toEqual(socketServer);
    });

    it('should save config', () => {
        element = $compile('<options></options>')($scope);
        $scope.$digest();

        var username = 'aaaaa';
        var address = 'bbbbb';

        element.find('#app-user').val(username).trigger('input');
        element.find('#socket-server-address').val(address).trigger('input');

        var saveButton = element.find('#submit');
        saveButton.triggerHandler('click');

        expect(config.setUsername).toHaveBeenCalledWith(username);
        expect(config.setSocketServerAddress).toHaveBeenCalledWith(address);
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
});
