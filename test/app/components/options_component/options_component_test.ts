import {Config} from '../../../../app/services/config';
import {Notifier} from '../../../../app/services/notifier';
import * as angular from 'angular';
import {Howl} from 'howler';
import {OptionsController} from '../../../../app/components/options_component/options_controller';
import {PullRequestProgress} from '../../../../app/models/pull_request_progress';

describe('OptionsComponent', () => {
    let config: Config,
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
        growl: angular.growl.IGrowlService,
        notifier: Notifier,
        $componentController: ng.IComponentControllerService;

    beforeEach(angular.mock.module('bitbucketNotifier.options'));
    beforeEach(angular.mock.module([
        '$provide',
        ($provide: ng.auto.IProvideService) => {
            appUser = null;
            socketServer = null;
            pullRequestProgress = PullRequestProgress.PROPORTIONS;
            newPullRequestSound = 'ring';
            approvedPullRequestSound = 'bell';
            mergedPullRequestSound = 'bell';
            reminderSound = 'alarm';

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

            $provide.value('Notifier', {
                notifyPullRequestUpdated: jasmine.createSpy('Notifier.notifyPullRequestUpdated'),
                notifyReminder: jasmine.createSpy('Notifier.notifyReminder'),
                notifyPullRequestMerged: jasmine.createSpy('Notifier.notifyPullRequestMerged'),
                notifyNewPullRequestAssigned: jasmine.createSpy('Notifier.notifyPullRequestAssigned'),
                notifyPullRequestApproved: jasmine.createSpy('Notifier.notifyPullRequestApproved'),
                notifyNewCommentAdded: jasmine.createSpy('Notifier.notifyNewCommentAdded'),
                notifyNewReplyOnComment: jasmine.createSpy('Notifier.notifyNewReplyOnComment')
            });
        }
    ]));
    beforeEach(inject([
        'Config',
        '$rootScope',
        '$compile',
        'growl',
        'Notifier',
        '$componentController',
        (c, $r, $c, g, n, $cc) => {
            config = c;
            $rootScope = $r;
            $scope = $rootScope;
            $compile = $c;
            growl = g;
            notifier = n;
            $componentController = $cc;
        }
    ]));

    it('should show empty form when configuration is empty', () => {
        element = $compile('<options></options>')($scope);
        $scope.$digest();

        const userElement = element.find('#app-user');
        const socketServerElement = element.find('#socket-server-address');
        const prProgressElement = element.find('input[name="pull-request-progress"]:checked');

        const newPullRequestSoundElement = element.find('select#new-pull-request-sound');
        const approvedPullRequestSoundElement = element.find('select#approved-pull-request-sound');
        const mergedPullRequestSoundElement = element.find('select#merged-pull-request-sound');
        const reminderSoundElement = element.find('select#reminder-sound');

        expect(userElement.val()).toEqual('');
        expect(socketServerElement.val()).toEqual('');
        expect(prProgressElement.val()).toEqual(PullRequestProgress.PROPORTIONS);
        expect(newPullRequestSoundElement.val()).toEqual('string:ring');
        expect(approvedPullRequestSoundElement.val()).toEqual('string:bell');
        expect(mergedPullRequestSoundElement.val()).toEqual('string:bell');
        expect(reminderSoundElement.val()).toEqual('string:alarm');
    });

    it('should show completed form if config is set', () => {
        appUser = 'john.smith';
        socketServer = 'http://localhost:1234';
        pullRequestProgress = PullRequestProgress.PERCENT;
        newPullRequestSound = 'ring';
        approvedPullRequestSound = 'bell';
        mergedPullRequestSound = 'bell';
        reminderSound = 'alarm';

        element = $compile('<options></options>')($scope);
        $scope.$digest();

        const userElement = element.find('#app-user');
        const socketServerElement = element.find('#socket-server-address');
        const prProgressElement = element.find('input[name="pull-request-progress"]:checked');

        const newPullRequestSoundElement = element.find('select#new-pull-request-sound');
        const approvedPullRequestSoundElement = element.find('select#approved-pull-request-sound');
        const mergedPullRequestSoundElement = element.find('select#merged-pull-request-sound');
        const reminderSoundElement = element.find('select#reminder-sound');

        expect(userElement.val()).toEqual(appUser);
        expect(socketServerElement.val()).toEqual(socketServer);
        expect(prProgressElement.val()).toEqual(pullRequestProgress);
        expect(newPullRequestSoundElement.val()).toEqual('string:ring');
        expect(approvedPullRequestSoundElement.val()).toEqual('string:bell');
        expect(mergedPullRequestSoundElement.val()).toEqual('string:bell');
        expect(reminderSoundElement.val()).toEqual('string:alarm');
    });

    it('should save config', () => {
        element = $compile('<options></options>')($scope);
        $scope.$digest();

        const username = 'aaaaa';
        const address = 'bbbbb';
        const newPrSound = 'alarm';
        const approvedPrSound = 'alarm';
        const mergedPrSound = 'alarm';
        const remindSound = 'bell';

        element.find('#app-user').val(username).trigger('input');
        element.find('#socket-server-address').val(address).trigger('input');
        element.find('input[name="pull-request-progress"][value="percent"]').click().triggerHandler('click');
        element.find('select#new-pull-request-sound').val(`string:${newPrSound}`).trigger('change');
        element.find('select#approved-pull-request-sound').val(`string:${approvedPrSound}`).trigger('change');
        element.find('select#merged-pull-request-sound').val(`string:${mergedPrSound}`).trigger('change');
        element.find('select#reminder-sound').val(`string:${remindSound}`).trigger('change');

        const saveButton = element.find('#submit');
        saveButton.triggerHandler('click');

        expect(config.setUsername).toHaveBeenCalledWith(username);
        expect(config.setSocketServerAddress).toHaveBeenCalledWith(address);
        expect(config.setPullRequestProgress).toHaveBeenCalledWith(PullRequestProgress.PERCENT);
        expect(config.setNewPullRequestSound).toHaveBeenCalledWith(newPrSound);
        expect(config.setApprovedPullRequestSound).toHaveBeenCalledWith(approvedPrSound);
        expect(config.setMergedPullRequestSound).toHaveBeenCalledWith(mergedPrSound);
        expect(config.setReminderSound).toHaveBeenCalledWith(remindSound);
    });

    it('should show growl message on save', () => {
        element = $compile('<options></options>')($scope);
        $scope.$digest();

        const username = 'aaaaa';
        const address = 'bbbbb';

        element.find('#app-user').val(username).trigger('input');
        element.find('#socket-server-address').val(address).trigger('input');

        const saveButton = element.find('#submit');
        saveButton.triggerHandler('click');

        expect(growl.success).toHaveBeenCalled();
    });

    it('should show warning that extension will soon reboot', () => {
        element = $compile('<options></options>')($scope);
        $scope.$digest();

        const username = 'aaaaa';
        const address = 'bbbbb';

        element.find('#app-user').val(username).trigger('input');
        element.find('#socket-server-address').val(address).trigger('input');

        const saveButton = element.find('#submit');
        saveButton.triggerHandler('click');

        expect(growl.warning).toHaveBeenCalled();
    });

    it('should play chosen sound', () => {
        spyOn(Howl.prototype, 'play').and.stub();

        const chosenSoundId = 'bell';
        const ctrl = $componentController('options', null) as OptionsController;
        ctrl.playSound(chosenSoundId);

        expect(Howl.prototype.play).toHaveBeenCalled();
    });

    describe('Notifications', () => {
        it('should show a new pull request notification', () => {
            expectNotificationShown('#assigned', notifier.notifyNewPullRequestAssigned);
        });

        it('should show an approval notification', () => {
            expectNotificationShown('#approved', notifier.notifyPullRequestApproved);
        });

        it('should show a merge notification', () => {
            expectNotificationShown('#merged', notifier.notifyPullRequestMerged);
        });

        it('should show a reminder notification', () => {
            expectNotificationShown('#remind', notifier.notifyReminder);
        });

        it('should show a pull request updated notification', () => {
            expectNotificationShown('#updated', notifier.notifyPullRequestUpdated);
        });

        it('should show a new comment notification', () => {
            expectNotificationShown('#commented', notifier.notifyNewCommentAdded);
        });

        it('should show a new reply for a comment notification', () => {
            expectNotificationShown('#replied', notifier.notifyNewReplyOnComment);
        });

        function expectNotificationShown(elementSelector: string, notifierFunc) {
            element = $compile('<options></options>')($scope);
            $scope.$digest();

            element.find(elementSelector).click().triggerHandler('click');

            expect(notifierFunc).toHaveBeenCalled();
        }
    });
});
