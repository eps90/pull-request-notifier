var typescript = require('gulp-typescript');
var lazypipe = require('lazypipe');
var less = require('gulp-less');
var tsOptions = {
        target: 'es5',
        module: 'commonjs',
        typescript: require('typescript'),
        sortOutput: true,
        removeComments: true
    };
var gulpIf = require('gulp-if');
var scriptsPipeLine = lazypipe()
    .pipe(function () {
        return gulpIf(/\.ts$/, typescript(tsOptions));
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
    }
};

module.exports = {
    bundle: {
        'assets/popup_vendor': {
            styles: [
                "bower_components/bootstrap/dist/css/bootstrap.css",
                "bower_components/angular-growl-v2/build/angular-growl.css",
                "bower_components/fontawesome/css/font-awesome.css",
                "bower_components/angular-emoji-filter/dist/emoji.min.css"
            ],
            scripts: [
                "bower_components/jquery/dist/jquery.js",
                "bower_components/angular/angular.min.js",
                "bower_components/angular-local-storage/dist/angular-local-storage.min.js",
                "bower_components/angular-bootstrap/ui-bootstrap.js",
                "bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
                "bower_components/angular-sanitize/angular-sanitize.js",
                "bower_components/lodash/lodash.min.js",
                "bower_components/angular-emoji-filter/dist/emoji.min.js",
                "bower_components/angular-ui-router/release/angular-ui-router.js",
                "bower_components/showdown/src/showdown.js",
                "bower_components/angular-markdown-directive/markdown.js",
                "bower_components/angular-animate/angular-animate.js"
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
                "app/components/section_title_component/section_title_component.less",
                "app/components/pull_request_link_component/pull_request_link_component.less",
                "app/components/navigation_bar_component/navigation_bar_component.less",
                "app/components/reminder_component/reminder_component.less",
                "app/components/approval_progress_component/approval_progress_component.less",
                "app/components/pull_request_preview_component/pull_request_preview_component.less",
                "app/components/reviewer_component/reviewer_component.less"
            ],
            scripts: [
                "app/components/pull_requests_list_component/pull_requests_list_component.ts",
                "app/components/user_vote_component/user_vote_component.ts",
                "app/components/pull_request_component/pull_request_component.ts",
                "app/components/pull_requests_header_component/pull_requests_header_component.ts",
                "app/components/approval_progress_component/approval_progress_component.ts",
                "app/components/section_title_component/section_title_component.ts",
                "app/components/pull_request_link_component/pull_request_link_component.ts",
                "app/components/navigation_bar_component/navigation_bar_component.ts",
                "app/components/navigation_brand_component/navigation_brand_component.ts",
                "app/components/reminder_component/reminder_component.ts",
                "app/components/pull_request_preview_component/pull_request_preview_component.ts",
                "app/components/reviewer_component/reviewer_component.ts",
                "app/services/models.ts",
                "app/services/pull_request_repository.ts",
                "app/services/config.ts",
                "app/services/sound_repository.ts",
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
                "bower_components/socket.io-client/socket.io.js",
                "bower_components/angular/angular.min.js",
                "bower_components/angular-local-storage/dist/angular-local-storage.min.js",
                "bower_components/angular-socket-io/socket.min.js",
                "bower_components/lodash/lodash.min.js",
                "bower_components/SoundJS/lib/soundjs-0.6.1.min.js"
            ],
            options: bundleOptions
        },
        'assets/background': {
            scripts: [
                "app/components/background_component/background_component.ts",
                "app/services/socket_manager.ts",
                "app/services/socket_handler.ts",
                "app/services/notifier.ts",
                "app/services/models.ts",
                "app/services/pull_request_repository.ts",
                "app/services/notification_repository.ts",
                "app/services/config.ts",
                "app/services/indicator.ts",
                "app/services/factories.ts",
                "app/services/sound_manager.ts",
                "app/services/sound_repository.ts",
                "app/modules/bitbucket_notifier_background.ts"
            ],
            options: bundleOptions
        },
        'assets/options_vendor': {
            styles: [
                "bower_components/bootstrap/dist/css/bootstrap.css",
                "bower_components/angular-growl-v2/build/angular-growl.css",
                "bower_components/fontawesome/css/font-awesome.css",
                "bower_components/angular-emoji-filter/dist/emoji.min.css"
            ],
            scripts: [
                "bower_components/jquery/dist/jquery.js",
                "bower_components/angular/angular.min.js",
                "bower_components/angular-local-storage/dist/angular-local-storage.min.js",
                "bower_components/angular-growl-v2/build/angular-growl.js",
                "bower_components/lodash/lodash.min.js",
                "bower_components/SoundJS/lib/soundjs-0.6.1.min.js"
            ],
            options: bundleOptions
        },
        'assets/options': {
            styles: [
                "assets/less/styles.less",
                "app/components/section_title_component/section_title_component.less",
                "app/components/navigation_bar_component/navigation_bar_component.less",
                "app/components/approval_progress_component/approval_progress_component.less"
            ],
            scripts: [
                "app/components/options_component/options_component.ts",
                "app/components/section_title_component/section_title_component.ts",
                "app/components/navigation_bar_component/navigation_bar_component.ts",
                "app/components/approval_progress_component/approval_progress_component.ts",
                "app/components/navigation_brand_component/navigation_brand_component.ts",
                "app/services/config.ts",
                "app/services/models.ts",
                "app/services/sound_manager.ts",
                "app/services/sound_repository.ts",
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
            src: 'bower_components/bootstrap/fonts/*.*',
            base: 'bower_components/bootstrap'
        },
        {
            src: 'bower_components/fontawesome/fonts/*.*',
            base: 'bower_components/fontawesome'
        },
        {
            src: ['assets/img/*.png', 'assets/sounds/*.ogg'],
            base: '.'
        }
    ]
};
