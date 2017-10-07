import './../app/vendor';
import 'angular-mocks';

import './../app/modules/bitbucket_notifier';
import './../app/modules/bitbucket_notifier_background';
import './../app/modules/bitbucket_notifier_options';

var testContext = require.context('.', true, /test.ts$/);
testContext.keys().forEach(testContext);
