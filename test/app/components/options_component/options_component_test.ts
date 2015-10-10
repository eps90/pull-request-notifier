///<reference path="../../../../app/_typings.ts"/>

describe('OptionsComponent', () => {
    var config: BitbucketNotifier.Config,
        appUser,
        socketServer,
        pullRequestProgress,
        newPullRequestSound,
        approvedPullRequestSound,
        mergedPullRequestSound,
        reminderSound,
        element: ng.IAugmentedJQuery,
        $rootScope: ng.IRootScopeService,
        $scope: ng.IScope,
        $compile: ng.ICompileService,
        growl: angular.growl.IGrowlService;

    beforeEach(() => {
        window['createjs'] = {
            Sound: {
                registerSound: jasmine.createSpy('createjs.Sound.registerSound'),
                play: jasmine.createSpy('createjs.Sound.play')
            }
        };
    });

    beforeEach(module('bitbucketNotifier.options'));
    beforeEach(module('bitbucketNotifier.templates'));

    beforeEach(module([
        '$provide',
        ($provide: ng.auto.IProvideService) => {
            appUser = null;
            socketServer = null;
            pullRequestProgress = BitbucketNotifier.PullRequestProgress.PROPORTIONS;
            newPullRequestSound = '../../assets/sounds/notification2.ogg';
            approvedPullRequestSound = '../../assets/sounds/notification.ogg';
            mergedPullRequestSound = '../../assets/sounds/notification.ogg';
            reminderSound = '../../assets/sounds/nuclear_alarm.ogg';

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
                getNewPullRequestSound: jasmine.createSpy('Config.getNewPullRequestSound').and.callFake(() => {
                    return newPullRequestSound;
                }),
                getApprovedPullRequestSound: jasmine.createSpy('Config.getNewPullRequestSound').and.callFake(() => {
                    return approvedPullRequestSound;
                }),
                getMergedPullRequestSound: jasmine.createSpy('Config.getNewPullRequestSound').and.callFake(() => {
                    return mergedPullRequestSound;
                }),
                getReminderSound: jasmine.createSpy('Config.getNewPullRequestSound').and.callFake(() => {
                    return reminderSound;
                }),
                setUsername: jasmine.createSpy('Config.setUsername'),
                setSocketServerAddress: jasmine.createSpy('Config.setSocketServerAddress'),
                setPullRequestProgress: jasmine.createSpy('Config.setPullRequestProgress'),
                setNewPullRequestSound: jasmine.createSpy('Config.setNewPullRequestSound'),
                setApprovedPullRequestSound: jasmine.createSpy('Config.setApprovedPullRequestSound'),
                setMergedPullRequestSound: jasmine.createSpy('Config.setMergedPullRequestSound'),
                setReminderSound: jasmine.createSpy('Config.setReminderRequestSound')
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
        (c, $r, $c, g, sm) => {
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

        var newPullRequestSoundElement = element.find('select#new-pull-request-sound');
        var approvedPullRequestSoundElement = element.find('select#approved-pull-request-sound');
        var mergedPullRequestSoundElement = element.find('select#merged-pull-request-sound');
        var reminderSoundElement = element.find('select#reminder-sound');

        expect(userElement.val()).toEqual('');
        expect(socketServerElement.val()).toEqual('');
        expect(prProgressElement.val()).toEqual(BitbucketNotifier.PullRequestProgress.PROPORTIONS);
        expect(newPullRequestSoundElement.val()).toEqual('string:../../assets/sounds/notification2.ogg');
        expect(approvedPullRequestSoundElement.val()).toEqual('string:../../assets/sounds/notification.ogg');
        expect(mergedPullRequestSoundElement.val()).toEqual('string:../../assets/sounds/notification.ogg');
        expect(reminderSoundElement.val()).toEqual('string:../../assets/sounds/nuclear_alarm.ogg');
    });

    it('should show completed form if config is set', () => {
        appUser = 'john.smith';
        socketServer = 'http://localhost:1234';
        pullRequestProgress = BitbucketNotifier.PullRequestProgress.PERCENT;
        newPullRequestSound = '../../assets/sounds/nuclear_alarm.ogg';
        approvedPullRequestSound = '../../assets/sounds/nuclear_alarm.ogg';
        mergedPullRequestSound = '../../assets/sounds/nuclear_alarm.ogg';
        reminderSound = '../../assets/sounds/nuclear_alarm.ogg';

        element = $compile('<options></options>')($scope);
        $scope.$digest();

        var userElement = element.find('#app-user');
        var socketServerElement = element.find('#socket-server-address');
        var prProgressElement = element.find('input[name="pull-request-progress"]:checked');

        var newPullRequestSoundElement = element.find('select#new-pull-request-sound');
        var approvedPullRequestSoundElement = element.find('select#approved-pull-request-sound');
        var mergedPullRequestSoundElement = element.find('select#merged-pull-request-sound');
        var reminderSoundElement = element.find('select#reminder-sound');

        expect(userElement.val()).toEqual(appUser);
        expect(socketServerElement.val()).toEqual(socketServer);
        expect(prProgressElement.val()).toEqual(pullRequestProgress);
        expect(newPullRequestSoundElement.val()).toEqual('string:../../assets/sounds/nuclear_alarm.ogg');
        expect(approvedPullRequestSoundElement.val()).toEqual('string:../../assets/sounds/nuclear_alarm.ogg');
        expect(mergedPullRequestSoundElement.val()).toEqual('string:../../assets/sounds/nuclear_alarm.ogg');
        expect(reminderSoundElement.val()).toEqual('string:../../assets/sounds/nuclear_alarm.ogg');
    });

    it('should save config', () => {
        element = $compile('<options></options>')($scope);
        $scope.$digest();

        var username = 'aaaaa';
        var address = 'bbbbb';
        var newPrSound = '../../assets/sounds/nuclear_alarm.ogg';
        var approvedPrSound = '../../assets/sounds/nuclear_alarm.ogg';
        var mergedPrSound = '../../assets/sounds/nuclear_alarm.ogg';
        var remindSound = '../../assets/sounds/notification2.ogg';

        element.find('#app-user').val(username).trigger('input');
        element.find('#socket-server-address').val(address).trigger('input');
        element.find('input[name="pull-request-progress"][value="percent"]').click().triggerHandler('click');
        element.find('select#new-pull-request-sound').val(`string:${newPrSound}`).trigger('change');
        element.find('select#approved-pull-request-sound').val(`string:${approvedPrSound}`).trigger('change');
        element.find('select#merged-pull-request-sound').val(`string:${mergedPrSound}`).trigger('change');
        element.find('select#reminder-sound').val(`string:${remindSound}`).trigger('change');

        var saveButton = element.find('#submit');
        saveButton.triggerHandler('click');

        expect(config.setUsername).toHaveBeenCalledWith(username);
        expect(config.setSocketServerAddress).toHaveBeenCalledWith(address);
        expect(config.setPullRequestProgress).toHaveBeenCalledWith(BitbucketNotifier.PullRequestProgress.PERCENT);
        expect(config.setNewPullRequestSound).toHaveBeenCalledWith(newPrSound);
        expect(config.setApprovedPullRequestSound).toHaveBeenCalledWith(approvedPrSound);
        expect(config.setMergedPullRequestSound).toHaveBeenCalledWith(mergedPrSound);
        expect(config.setReminderSound).toHaveBeenCalledWith(remindSound);
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
