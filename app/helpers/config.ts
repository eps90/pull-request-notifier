import {ConfigProvider} from '../services/config/config_provider';
import {InMemoryConfigStorage} from '../services/config/in_memory_config_storage';
import {ConfigObject} from '../models/config_object';
import {PullRequestProgress} from '../models/pull_request_progress';

export function setUpConfig(module: ng.IModule) {
    module.config(['configProvider', (configProvider: ConfigProvider) => {
        if (TEST) {
            configProvider.useCustomStorage(new InMemoryConfigStorage());
        }
        configProvider.setDefaults(new Map([
            [ConfigObject.PULLREQUEST_PROGRESS, PullRequestProgress.PROPORTIONS],
            [ConfigObject.NEW_PULLREQUEST_SOUND, 'bell'],
            [ConfigObject.APPROVED_PULLREQUEST_SOUND, 'ring'],
            [ConfigObject.MERGED_PULLREQUEST_SOUND, 'ring'],
            [ConfigObject.REMINDER_SOUND, 'alarm'],
        ]));
    }]);

}
