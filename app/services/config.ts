///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    'use strict';

    export class Config {
        static $inject: Array<string> = ['localStorageService'];

        private soundsDefaults: any = {};

        constructor(private localStorageService: angular.local.storage.ILocalStorageService) {
            var basePath = '../../assets/sounds/';
            this.soundsDefaults[Sound.NEW_PULLREQUEST] = basePath + 'notification2.ogg';
            this.soundsDefaults[Sound.APPROVED_PULLREQUEST] = basePath + 'notification.ogg';
            this.soundsDefaults[Sound.MERGED_PULLREQUEST] = basePath + 'notification.ogg';
            this.soundsDefaults[Sound.REMINDER] = basePath + 'nuclear_alarm.ogg';
        }

        getUsername(): any {
            return this.localStorageService.get(ConfigObject.USER);
        }

        setUsername(username: string): void {
            this.localStorageService.set(ConfigObject.USER, username);
        }

        getSocketServerAddress(): string {
            var address: string = <string>this.localStorageService.get(ConfigObject.SOCKET_SERVER);
            var addressWithHttp = _.trimLeft(address, 'http://');
            return 'http://' + addressWithHttp;
        }

        setSocketServerAddress(socketServerAddress: string): void {
            this.localStorageService.set(ConfigObject.SOCKET_SERVER, socketServerAddress);
        }

        getPullRequestProgress(): string {
            return this.localStorageService.get<string>(ConfigObject.PULLREQUEST_PROGRESS) || 'proportions';
        }

        setPullRequestProgress(option: string): void {
            this.localStorageService.set(ConfigObject.PULLREQUEST_PROGRESS, option);
        }

        setNewPullRequestSound(soundPath: string): void {
            this.localStorageService.set(Sound.NEW_PULLREQUEST, soundPath);
        }

        getNewPullRequestSound(): string {
            return <string> this.localStorageService.get(Sound.NEW_PULLREQUEST)
                || this.soundsDefaults[Sound.NEW_PULLREQUEST];
        }

        setApprovedPullRequestSound(soundPath: string): void {
            this.localStorageService.set(Sound.APPROVED_PULLREQUEST, soundPath);
        }

        getApprovedPullRequestSound(): string {
            return <string> this.localStorageService.get(Sound.APPROVED_PULLREQUEST)
                || this.soundsDefaults[Sound.APPROVED_PULLREQUEST];
        }

        setMergedPullRequestSound(soundPath: string): void {
            this.localStorageService.set(Sound.MERGED_PULLREQUEST, soundPath);
        }

        getMergedPullRequestSound(): string {
            return <string> this.localStorageService.get(Sound.MERGED_PULLREQUEST)
                || this.soundsDefaults[Sound.MERGED_PULLREQUEST];
        }

        setReminderSound(soundPath: string): void {
            this.localStorageService.set(Sound.REMINDER, soundPath);
        }

        getReminderSound(): string {
            return <string> this.localStorageService.get(Sound.REMINDER)
                || this.soundsDefaults[Sound.REMINDER];
        }
    }
}
