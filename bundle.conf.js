var typescript = require('gulp-typescript');
var tslint = require('gulp-tslint');
var lazypipe = require('lazypipe');
var less = require('gulp-less');
var tsOptions = {
        target: 'es5',
        module: 'commonjs',
        typescript: require('typescript'),
        sortOutput: true,
        removeComments: true
    },
    tsLintOptions = {
        tslint: require('tslint'),
        emitError: false
    };

var gulpIf = require('gulp-if');

var typeScriptPipeLine = lazypipe()
    .pipe(tslint)
    .pipe(tslint.report, 'prose', tsLintOptions)
    .pipe(typescript, tsOptions);

var scriptsPipeLine = lazypipe()
    .pipe(function () {
        return gulpIf(/\.ts$/, typeScriptPipeLine());
    });

var stylesPipeline = lazypipe()
    .pipe(function () {
        return gulpIf(/\.less$/, less());
    });

var bundleOptions = {
    pluginOptions: {
        'gulp-sourcemaps': {
            destPath: ''
        }
    },
    transforms: {
        scripts: scriptsPipeLine,
        styles: stylesPipeline
    },
    uglify: ['production'],
    minCss: ['production']
};

module.exports = {
    bundle: {
        'assets/common': {
            styles: [
                "node_modules/bootstrap/dist/css/bootstrap.css",
                "node_modules/angular-growl-v2/build/angular-growl.css",
                "node_modules/font-awesome/css/font-awesome.css",
                "bower_components/angular-emoji-filter/dist/emoji.min.css",
                "assets/less/styles.less",
                "app/components/section_title_component/section_title_component.less",
                "app/components/navigation_bar_component/navigation_bar_component.less",
                "app/components/approval_progress_component/approval_progress_component.less"
            ],
            scripts: [
                "node_modules/angular/angular.min.js",
                "node_modules/angular-local-storage/dist/angular-local-storage.min.js",
                "node_modules/lodash/index.js",
                "app/components/section_title_component/section_title_component.ts",
                "app/components/navigation_bar_component/navigation_bar_component.ts",
                "app/components/approval_progress_component/approval_progress_component.ts",
                "app/components/navigation_brand_component/navigation_brand_component.ts",
                "app/services/config.ts",
                "app/services/models.ts",
                "app/services/sound_repository.ts"
            ],
            options: bundleOptions
        },
        'assets/popup_vendor': {
            scripts: [
                "node_modules/jquery/dist/jquery.js",
                "bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
                "node_modules/angular-sanitize/angular-sanitize.js",
                "bower_components/angular-emoji-filter/dist/emoji.min.js",
                "node_modules/angular-ui-router/release/angular-ui-router.js",
                "node_modules/showdown/src/showdown.js",
                "node_modules/angular-markdown-directive/markdown.js",
                "node_modules/angular-animate/angular-animate.js"
            ],
            options: bundleOptions
        },
        'assets/popup': {
            styles: [
                "assets/less/styles.less",
                "app/components/pull_requests_list_component/pull_requests_list_component.less",
                "app/components/pull_requests_header_component/pull_requests_header_component.less",
                "app/components/pull_request_component/pull_request_component.less",
                "app/components/user_vote_component/user_vote_component.less",
                "app/components/pull_request_link_component/pull_request_link_component.less",
                "app/components/reminder_component/reminder_component.less",
                "app/components/pull_request_preview_component/pull_request_preview_component.less",
                "app/components/reviewer_component/reviewer_component.less"
            ],
            scripts: [
                "app/components/pull_requests_list_component/pull_requests_list_component.ts",
                "app/components/user_vote_component/user_vote_component.ts",
                "app/components/pull_request_component/pull_request_component.ts",
                "app/components/pull_requests_header_component/pull_requests_header_component.ts",
                "app/components/pull_request_link_component/pull_request_link_component.ts",
                "app/components/reminder_component/reminder_component.ts",
                "app/components/pull_request_preview_component/pull_request_preview_component.ts",
                "app/components/reviewer_component/reviewer_component.ts",
                "app/services/pull_request_repository.ts",
                "app/services/factories.ts",
                "app/filters/assigned_filter.ts",
                "app/filters/authored_filter.ts",
                "app/filters/unapproved_first_filter.ts",
                "app/config/routing.ts",
                "app/modules/bitbucket_notifier.ts"
            ],
            options: bundleOptions
        },
        'assets/popup_templates': {
            scripts: [
                "build/modules/templates.js"
            ],
            options: bundleOptions
        },
        'assets/background_vendor': {
            scripts: [
                "node_modules/socket.io-client/dist/socket.io.js",
                "node_modules/angular-local-storage/dist/angular-local-storage.min.js",
                "node_modules/angular-socket-io/socket.min.js",
                "node_modules/createjs-soundjs/lib/soundjs-0.6.2.min.js"
            ],
            options: bundleOptions
        },
        'assets/background': {
            scripts: [
                "app/components/background_component/background_component.ts",
                "app/services/socket_manager.ts",
                "app/services/socket_handler.ts",
                "app/services/notifier.ts",
                "app/services/pull_request_repository.ts",
                "app/services/notification_repository.ts",
                "app/services/indicator.ts",
                "app/services/factories.ts",
                "app/services/sound_manager.ts",
                "app/modules/bitbucket_notifier_background.ts"
            ],
            options: bundleOptions
        },
        'assets/options_vendor': {
            scripts: [
                "node_modules/jquery/dist/jquery.js",
                "node_modules/angular/angular.min.js",
                "node_modules/angular-growl-v2/build/angular-growl.js",
                "node_modules/createjs-soundjs/lib/soundjs-0.6.2.min.js"
            ],
            options: bundleOptions
        },
        'assets/options': {
            scripts: [
                "app/components/options_component/options_component.ts",
                "app/components/section_title_component/section_title_component.ts",
                "app/components/navigation_bar_component/navigation_bar_component.ts",
                "app/components/approval_progress_component/approval_progress_component.ts",
                "app/components/navigation_brand_component/navigation_brand_component.ts",
                "app/services/sound_manager.ts",
                'app/services/notifier.ts',
                'app/services/notification_repository.ts',
                "app/modules/bitbucket_notifier_options.ts"
            ],
            options: bundleOptions
        },
        'assets/options_templates': {
            scripts: [
                "build/modules/templates_options_module.js"
            ],
            options: bundleOptions
        }
    },
    copy: [
        {
            src: 'node_modules/bootstrap/fonts/*.*',
            base: 'node_modules/bootstrap'
        },
        {
            src: 'node_modules/font-awesome/fonts/*.*',
            base: 'node_modules/font-awesome'
        },
        {
            src: ['assets/img/*.png', 'assets/sounds/*.ogg'],
            base: '.'
        }
    ]
};
