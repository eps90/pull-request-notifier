import './../app/vendor';
import 'angular-mocks';
import './chrome-mock';

import './../app/modules/bitbucket_notifier';
import './../app/modules/bitbucket_notifier_background';
import './../app/modules/bitbucket_notifier_options';
import './../app/modules/eps_config';

var testContext = require.context('.', true, /test.ts$/);
testContext.keys().forEach(testContext);
