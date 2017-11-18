import * as angular from 'angular';
import {AngularLocalStorageStorage} from '../services/config/angular_localstorage_storage';

const application = angular.module('eps.config', ['LocalStorageModule']);

application.service('config.storage.ngLocalStorage', AngularLocalStorageStorage);
