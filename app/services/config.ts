import {SoundRepository} from './sound_repository';
import * as _ from 'lodash';
import {NotificationSound} from '../models/notification_sound';
import {ConfigObject} from '../models/config_object';

export class Config {
    public static $inject: string[] = ['localStorageService', 'SoundRepository'];

    private soundsDefaults: any = {};

    constructor(
        private localStorageService: angular.local.storage.ILocalStorageService,
        soundRepository: SoundRepository
    ) {
        this.soundsDefaults[NotificationSound.NEW_PULLREQUEST] = soundRepository.findById('bell').id;
        this.soundsDefaults[NotificationSound.APPROVED_PULLREQUEST] = soundRepository.findById('ring').id;
        this.soundsDefaults[NotificationSound.MERGED_PULLREQUEST] = soundRepository.findById('ring').id;
        this.soundsDefaults[NotificationSound.REMINDER] = soundRepository.findById('alarm').id;
    }

    // setting up username
    public getUsername(): any {
        return this.localStorageService.get(ConfigObject.USER);
    }

    public setUsername(username: string): void {
        this.localStorageService.set(ConfigObject.USER, username);
    }

    // setting up socker server
    public getSocketServerAddress(): string {
        const address: string = this.localStorageService.get(ConfigObject.SOCKET_SERVER) as string;
        const addressWithHttp = _.trimStart(address, 'http://');
        return 'http://' + addressWithHttp;
    }

    public setSocketServerAddress(socketServerAddress: string): void {
        this.localStorageService.set(ConfigObject.SOCKET_SERVER, socketServerAddress);
    }

    // setting up pull request progress
    public getPullRequestProgress(): string {
        return this.localStorageService.get<string>(ConfigObject.PULLREQUEST_PROGRESS) || 'proportions';
    }

    public setPullRequestProgress(option: string): void {
        this.localStorageService.set(ConfigObject.PULLREQUEST_PROGRESS, option);
    }

    // setting up sounds
    public setNewPullRequestSound(soundId: string): void {
        this.localStorageService.set(NotificationSound.NEW_PULLREQUEST, soundId);
    }

    public getNewPullRequestSound(): string {
        return this.getSound(NotificationSound.NEW_PULLREQUEST);
    }

    public setApprovedPullRequestSound(soundId: string): void {
        this.localStorageService.set(NotificationSound.APPROVED_PULLREQUEST, soundId);
    }

    public getApprovedPullRequestSound(): string {
        return this.getSound(NotificationSound.APPROVED_PULLREQUEST);
    }

    public setMergedPullRequestSound(soundId: string): void {
        this.localStorageService.set(NotificationSound.MERGED_PULLREQUEST, soundId);
    }

    public getMergedPullRequestSound(): string {
        return this.getSound(NotificationSound.MERGED_PULLREQUEST);
    }

    public setReminderSound(soundId: string): void {
        this.localStorageService.set(NotificationSound.REMINDER, soundId);
    }

    public getReminderSound(): string {
        return this.getSound(NotificationSound.REMINDER);
    }

    private getSound(soundId: string): string {
        return this.localStorageService.get(soundId) as string || this.soundsDefaults[soundId] || null;
    }
}
