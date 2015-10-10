///<reference path="../_typings.ts"/>

module BitbucketNotifier {
    'use strict';

    export class Config {
        static $inject: Array<string> = ['localStorageService', 'SoundRepository'];

        private soundsDefaults: any = {};

        constructor(private localStorageService: angular.local.storage.ILocalStorageService, soundRepository: SoundRepository) {
            this.soundsDefaults[Sound.NEW_PULLREQUEST] = soundRepository.findByLabel('Bell').path;
            this.soundsDefaults[Sound.APPROVED_PULLREQUEST] = soundRepository.findByLabel('Ring').path;
            this.soundsDefaults[Sound.MERGED_PULLREQUEST] = soundRepository.findByLabel('Ring').path;
            this.soundsDefaults[Sound.REMINDER] = soundRepository.findByLabel('Nuclear alarm').path;
        }

        // Username
        getUsername(): any {
            return this.localStorageService.get(ConfigObject.USER);
        }

        setUsername(username: string): void {
            this.localStorageService.set(ConfigObject.USER, username);
        }

        // Socker server
        getSocketServerAddress(): string {
            var address: string = <string>this.localStorageService.get(ConfigObject.SOCKET_SERVER);
            var addressWithHttp = _.trimLeft(address, 'http://');
            return 'http://' + addressWithHttp;
        }

        setSocketServerAddress(socketServerAddress: string): void {
            this.localStorageService.set(ConfigObject.SOCKET_SERVER, socketServerAddress);
        }

        // Pull request progress
        getPullRequestProgress(): string {
            return this.localStorageService.get<string>(ConfigObject.PULLREQUEST_PROGRESS) || 'proportions';
        }

        setPullRequestProgress(option: string): void {
            this.localStorageService.set(ConfigObject.PULLREQUEST_PROGRESS, option);
        }

        // Sounds
        setNewPullRequestSound(soundPath: string): void {
            this.localStorageService.set(Sound.NEW_PULLREQUEST, soundPath);
        }

        getNewPullRequestSound(): string {
            return this.getSound(Sound.NEW_PULLREQUEST);
        }

        setApprovedPullRequestSound(soundPath: string): void {
            this.localStorageService.set(Sound.APPROVED_PULLREQUEST, soundPath);
        }

        getApprovedPullRequestSound(): string {
            return this.getSound(Sound.APPROVED_PULLREQUEST);
        }

        setMergedPullRequestSound(soundPath: string): void {
            this.localStorageService.set(Sound.MERGED_PULLREQUEST, soundPath);
        }

        getMergedPullRequestSound(): string {
            return this.getSound(Sound.MERGED_PULLREQUEST);
        }

        setReminderSound(soundPath: string): void {
            this.localStorageService.set(Sound.REMINDER, soundPath);
        }

        getReminderSound(): string {
            return this.getSound(Sound.REMINDER);
        }

        private getSound(soundId: string): string {
            return <string> this.localStorageService.get(soundId) || this.soundsDefaults[soundId] || null;
        }
    }
}
