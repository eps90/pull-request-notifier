import {ConfigObject, NotificationSound} from "./models";
import {SoundRepository} from "./sound_repository";
import * as _ from 'lodash';

export class Config {
    static $inject: Array<string> = ['localStorageService', 'SoundRepository'];

    private soundsDefaults: any = {};

    constructor(private localStorageService: angular.local.storage.ILocalStorageService, soundRepository: SoundRepository) {
        this.soundsDefaults[NotificationSound.NEW_PULLREQUEST] = soundRepository.findById('bell').soundPath;
        this.soundsDefaults[NotificationSound.APPROVED_PULLREQUEST] = soundRepository.findById('ring').soundPath;
        this.soundsDefaults[NotificationSound.MERGED_PULLREQUEST] = soundRepository.findById('ring').soundPath;
        this.soundsDefaults[NotificationSound.REMINDER] = soundRepository.findById('alarm').soundPath;
    }

    // setting up username
    getUsername(): any {
        return this.localStorageService.get(ConfigObject.USER);
    }

    setUsername(username: string): void {
        this.localStorageService.set(ConfigObject.USER, username);
    }

    // setting up socker server
    getSocketServerAddress(): string {
        var address: string = <string>this.localStorageService.get(ConfigObject.SOCKET_SERVER);
        var addressWithHttp = _.trimStart(address, 'http://');
        return 'http://' + addressWithHttp;
    }

    setSocketServerAddress(socketServerAddress: string): void {
        this.localStorageService.set(ConfigObject.SOCKET_SERVER, socketServerAddress);
    }

    // setting up pull request progress
    getPullRequestProgress(): string {
        return this.localStorageService.get<string>(ConfigObject.PULLREQUEST_PROGRESS) || 'proportions';
    }

    setPullRequestProgress(option: string): void {
        this.localStorageService.set(ConfigObject.PULLREQUEST_PROGRESS, option);
    }

    // setting up sounds
    setNewPullRequestSound(soundPath: string): void {
        this.localStorageService.set(NotificationSound.NEW_PULLREQUEST, soundPath);
    }

    getNewPullRequestSound(): string {
        return this.getSound(NotificationSound.NEW_PULLREQUEST);
    }

    setApprovedPullRequestSound(soundPath: string): void {
        this.localStorageService.set(NotificationSound.APPROVED_PULLREQUEST, soundPath);
    }

    getApprovedPullRequestSound(): string {
        return this.getSound(NotificationSound.APPROVED_PULLREQUEST);
    }

    setMergedPullRequestSound(soundPath: string): void {
        this.localStorageService.set(NotificationSound.MERGED_PULLREQUEST, soundPath);
    }

    getMergedPullRequestSound(): string {
        return this.getSound(NotificationSound.MERGED_PULLREQUEST);
    }

    setReminderSound(soundPath: string): void {
        this.localStorageService.set(NotificationSound.REMINDER, soundPath);
    }

    getReminderSound(): string {
        return this.getSound(NotificationSound.REMINDER);
    }

    private getSound(soundId: string): string {
        return <string> this.localStorageService.get(soundId) || this.soundsDefaults[soundId] || null;
    }
}
