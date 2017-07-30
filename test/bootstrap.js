import * as angular from 'angular';
import 'angular-mocks';

const testContext = require.context('.', true, /test.ts$/);
testContext.keys().forEach(testContext);
