import * as angular from 'angular';
import {AngularLocalStorageStorage} from '../services/config/angular_localstorage_storage';
import {ConfigProvider} from '../services/config/config_provider';

const application = angular.module('eps.config', ['LocalStorageModule']);

application.service('config.storage.ngLocalStorage', AngularLocalStorageStorage);
application.service('config.storage', AngularLocalStorageStorage);
application.provider('config', ConfigProvider);
