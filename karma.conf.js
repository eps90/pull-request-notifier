// Karma configuration
// Generated on Sun Aug 09 2015 21:31:51 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    jasmineDiffReporter: {
        pretty: true,
        multiline: true
    },


    // list of files / patterns to load in the browser
    files: [
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/angular/angular.min.js',
        'node_modules/angular-mocks/angular-mocks.js',
        'node_modules/angular-local-storage/dist/angular-local-storage.min.js',
        'node_modules/socket.io-client/dist/socket.io.js',
        'node_modules/lodash/index.js',
        'node_modules/angular-socket.io-mock/angular-socket.io-mock.js',
        'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
        'node_modules/angular-growl-v2/build/angular-growl.js',
        'bower_components/angular-emoji-filter/dist/emoji.min.js',
        'node_modules/angular-sanitize/angular-sanitize.js',
        'node_modules/createjs-soundjs/lib/soundjs-0.6.2.min.js',
        'node_modules/angular-ui-router/release/angular-ui-router.js',
        'node_modules/showdown/src/showdown.js',
        'node_modules/angular-markdown-directive/markdown.js',
        'node_modules/angular-animate/angular-animate.js',
        'build/**/!(bitbucket_notifier*).js',
        'build/app/modules/bitbucket_notifier.js',
        'build/app/modules/bitbucket_notifier_background.js',
        'build/app/modules/bitbucket_notifier_options.js',
        'build/**/*.html'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      "**/*.html": ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
        stripPrefix: "build/app/",
        prependPrefix: "../",
        moduleName: 'bitbucketNotifier.templates'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['jasmine-diff', 'dots'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  })
};
