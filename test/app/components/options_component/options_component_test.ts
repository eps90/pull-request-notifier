///<reference path="../../../../app/_typings.ts"/>

fdescribe('OptionsComponent', () => {
    var config: BitbucketNotifier.Config,
        appUser,
        socketServer,
        element: ng.IAugmentedJQuery,
        $rootScope: ng.IRootScopeService,
        $scope: ng.IScope,
        $compile: ng.ICompileService;

    beforeEach(module([
        '$provide',
        ($provide: ng.auto.IProvideService) => {
            appUser = socketServer = null;
            $provide.value('Config', {
                getUsername: jasmine.createSpy('Config.getUsername').and.callFake(() => {
                    return appUser;
                }),
                getSocketServerAddress: jasmine.createSpy('Config.getSocketServerAddress').and.callFake(() => {
                    return socketServer;
                })
            });
        }
    ]));
    beforeEach(module('bitbucketNotifier.options'));
    beforeEach(module('bitbucketNotifier.templates'));
    beforeEach(inject([
        'Config',
        '$rootScope',
        '$compile',
        (c, $r, $c) => {
            config = c;
            $rootScope = $r;
            $scope = $rootScope;
            $compile = $c;
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
});
