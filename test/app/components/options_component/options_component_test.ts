import {Notifier} from '../../../../app/services/notifier';
import * as angular from 'angular';
import {Howl} from 'howler';
import {OptionsController} from '../../../../app/components/options_component/options_controller';
import {PullRequestProgress} from '../../../../app/models/pull_request_progress';
import {languages} from '../../services/mock/languages';
import {LanguageRepositoryInterface} from '../../../../app/services/language_repository/language_repository_interface';
import {ConfigProvider} from '../../../../app/services/config/config_provider';
import {InMemoryConfigStorage} from '../../../../app/services/config/in_memory_config_storage';
import {ConfigObject} from '../../../../app/models/config_object';
import {Config} from '../../../../app/services/config/config';

describe('OptionsComponent', () => {
    let config: Config;
    let element: ng.IAugmentedJQuery;
    let $rootScope: ng.IRootScopeService;
    let $scope: ng.IScope;
    let $compile: ng.ICompileService;
    let growl: angular.growl.IGrowlService;
    let notifier: Notifier;
    let $componentController: ng.IComponentControllerService;
    let languageRepository: LanguageRepositoryInterface;

    beforeEach(angular.mock.module('bitbucketNotifier.options'));
    beforeEach(angular.mock.module([
        'configProvider',
        '$provide',
        (configProvider: ConfigProvider, $provide: ng.auto.IProvideService) => {
            $provide.value('languages', languages);

            const configDefaults = new Map([
                [ConfigObject.PULLREQUEST_PROGRESS, PullRequestProgress.PROPORTIONS],
                [ConfigObject.NEW_PULLREQUEST_SOUND, 'ring'],
                [ConfigObject.APPROVED_PULLREQUEST_SOUND, 'bell'],
                [ConfigObject.MERGED_PULLREQUEST_SOUND, 'bell'],
                [ConfigObject.REMINDER_SOUND, 'alarm'],
                [ConfigObject.LANGUAGE, languages[0].code]
            ]);
            configProvider.useCustomStorage(new InMemoryConfigStorage());
            configProvider.setDefaults(configDefaults);

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
        'config',
        '$rootScope',
        '$compile',
        'growl',
        'Notifier',
        '$componentController',
        'LanguageRepository',
        (c, $r, $c, g, n, $cc, lr) => {
            config = c;
            $rootScope = $r;
            $scope = $rootScope;
            $compile = $c;
            growl = g;
            notifier = n;
            $componentController = $cc;
            languageRepository = lr;
        }
    ]));

    it('should show an empty form when configuration is empty', () => {
        element = $compile('<options></options>')($scope);
        $scope.$digest();

        const userElement = element.find('#app-user');
        const socketServerElement = element.find('#socket-server-address');
        const prProgressElement = element.find('input[name="pull-request-progress"]:checked');

        const newPullRequestSoundElement = element.find('select#new-pull-request-sound');
        const approvedPullRequestSoundElement = element.find('select#approved-pull-request-sound');
        const mergedPullRequestSoundElement = element.find('select#merged-pull-request-sound');
        const reminderSoundElement = element.find('select#reminder-sound');
        const languageElement = element.find('select#language');

        expect(userElement.val()).toEqual('');
        expect(socketServerElement.val()).toEqual('');
        expect(prProgressElement.val()).toEqual(PullRequestProgress.PROPORTIONS);
        expect(newPullRequestSoundElement.val()).toEqual('string:ring');
        expect(approvedPullRequestSoundElement.val()).toEqual('string:bell');
        expect(mergedPullRequestSoundElement.val()).toEqual('string:bell');
        expect(reminderSoundElement.val()).toEqual('string:alarm');
        expect(languageElement.val()).toEqual('string:en');
    });

    it('should show completed form if config is set', async () => {
        await config.save(new Map([
            [ConfigObject.USER, 'john.smith'],
            [ConfigObject.SOCKET_SERVER, 'http://localhost:1234'],
            [ConfigObject.PULLREQUEST_PROGRESS, PullRequestProgress.PERCENT],
            [ConfigObject.NEW_PULLREQUEST_SOUND, 'ring'],
            [ConfigObject.APPROVED_PULLREQUEST_SOUND, 'bell'],
            [ConfigObject.MERGED_PULLREQUEST_SOUND, 'bell'],
            [ConfigObject.REMINDER_SOUND, 'alarm'],
            [ConfigObject.LANGUAGE, 'en']
        ]));

        element = $compile('<options></options>')($scope);
        $scope.$digest();

        const userElement = element.find('#app-user');
        const socketServerElement = element.find('#socket-server-address');
        const prProgressElement = element.find('input[name="pull-request-progress"]:checked');

        const newPullRequestSoundElement = element.find('select#new-pull-request-sound');
        const approvedPullRequestSoundElement = element.find('select#approved-pull-request-sound');
        const mergedPullRequestSoundElement = element.find('select#merged-pull-request-sound');
        const reminderSoundElement = element.find('select#reminder-sound');
        const languageElement = element.find('select#language');

        expect(userElement.val()).toEqual('john.smith');
        expect(socketServerElement.val()).toEqual('http://localhost:1234');
        expect(prProgressElement.val()).toEqual(PullRequestProgress.PERCENT);
        expect(newPullRequestSoundElement.val()).toEqual('string:ring');
        expect(approvedPullRequestSoundElement.val()).toEqual('string:bell');
        expect(mergedPullRequestSoundElement.val()).toEqual('string:bell');
        expect(reminderSoundElement.val()).toEqual('string:alarm');
        expect(languageElement.val()).toEqual('string:en');
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
        const newLanguage = 'de';

        element.find('#app-user').val(username).trigger('input');
        element.find('#socket-server-address').val(address).trigger('input');
        element.find('input[name="pull-request-progress"][value="percent"]').click().triggerHandler('click');
        element.find('select#new-pull-request-sound').val(`string:${newPrSound}`).trigger('change');
        element.find('select#approved-pull-request-sound').val(`string:${approvedPrSound}`).trigger('change');
        element.find('select#merged-pull-request-sound').val(`string:${mergedPrSound}`).trigger('change');
        element.find('select#reminder-sound').val(`string:${remindSound}`).trigger('change');
        element.find('select#language').val(`string:${newLanguage}`).trigger('change');

        const saveButton = element.find('#submit');
        saveButton.triggerHandler('click');

        expect(config.getItem(ConfigObject.USER)).toEqual(username);
        expect(config.getItem(ConfigObject.SOCKET_SERVER)).toEqual(address);
        expect(config.getItem(ConfigObject.PULLREQUEST_PROGRESS)).toEqual(PullRequestProgress.PERCENT);
        expect(config.getItem(ConfigObject.NEW_PULLREQUEST_SOUND)).toEqual(newPrSound);
        expect(config.getItem(ConfigObject.APPROVED_PULLREQUEST_SOUND)).toEqual(approvedPrSound);
        expect(config.getItem(ConfigObject.MERGED_PULLREQUEST_SOUND)).toEqual(mergedPrSound);
        expect(config.getItem(ConfigObject.REMINDER_SOUND)).toEqual(remindSound);
        expect(config.getItem(ConfigObject.LANGUAGE)).toEqual(newLanguage);
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

    describe('Language', () => {
        it('should save language config immediately', () => {
            element = $compile('<options></options>')($scope);
            $scope.$digest();

            const languageElement = element.find('select#language');
            languageElement.val('string:fr').triggerHandler('change');

            expect(config.getItem(ConfigObject.LANGUAGE)).toEqual('fr');
        });
    });
});
