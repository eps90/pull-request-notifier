var gulp = require('gulp');
var del = require('del');
var typescript = require('gulp-typescript');
var karmaServer = require('karma').Server;
var merge = require('merge-stream');
var flatten = require('gulp-flatten');
var gutil = require('gulp-util');
var debug = require('gulp-debug');
var sourcemaps = require('gulp-sourcemaps');
var minifyCss = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var less = require('gulp-less');
var ngTemplates = require('gulp-ng-templates');
var change = require('gulp-change');
var crx = require('gulp-crx-pack');

var typeScriptOptions = {
    target: 'es5',
    module: 'commonjs',
    typescript: require('typescript'),
    sortOutput: true
};

gulp.task('clean', function () {
    return del(['build/*', 'build', 'dist/*', 'dist']);
});

gulp.task('copy', ['clean'], function () {
    var resources = gulp.src(['assets/img/*.png', 'assets/sounds/*.ogg'], {base: '.'})
        .pipe(gulp.dest('build'));

    var templates = gulp.src(['app/views/*.html'], {base: 'app'})
        .pipe(gulp.dest('build'));

    var fonts = gulp.src(['bower_components/bootstrap/fonts/*.*', 'bower_components/fontawesome/fonts/*.*'], {base: '.'})
        .pipe(flatten())
        .pipe(gulp.dest('build/fonts'));

    return merge(resources, templates, fonts);
});

gulp.task('ngTemplates', ['clean'], function () {
    var popup = gulp.src(['app/components/**/*.html'])
        .pipe(ngTemplates({
            filename: 'templates.js',
            module: 'bitbucketNotifier',
            standalone: false,
            path: function (path) {
                return path.replace(/(.+)\/app\//, '../');
            }
        }))
        .pipe(gulp.dest('build/modules'));

    var options = gulp.src(['app/components/**/*.html'])
        .pipe(ngTemplates({
            filename: 'templates_options_module.js',
            module: 'bitbucketNotifier.options',
            standalone: false,
            path: function (path) {
                return path.replace(/(.+)\/app\//, '../');
            }
        }))
        .pipe(gulp.dest('build/modules'));

    return merge(popup, options);
});

// @TODO: Move file list into some config file
gulp.task('assets', ['clean', 'ngTemplates'], function () {
    var vendorScripts = gulp.src([
            'bower_components/jquery/dist/jquery.js',
            'bower_components/angular/angular.min.js',
            'bower_components/socket.io-client/socket.io.js',
            'bower_components/angular-local-storage/dist/angular-local-storage.min.js',
            'bower_components/angular-bootstrap/ui-bootstrap.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/lodash/lodash.min.js',
            'bower_components/angular-emoji-filter/dist/emoji.min.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/showdown/src/showdown.js',
            'bower_components/angular-markdown-directive/markdown.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/SoundJS/lib/soundjs-0.6.1.min.js',
            'bower_components/angular-socket-io/socket.min.js',
            'bower_components/angular-growl-v2/build/angular-growl.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('vendor_scripts.js'))
        .pipe(uglify())
        .pipe(rev())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/assets'));

    var vendorStyles = gulp.src([
            'bower_components/bootstrap/dist/css/bootstrap.css',
            'bower_components/angular-growl-v2/build/angular-growl.css',
            'bower_components/fontawesome/css/font-awesome.css',
            'bower_components/angular-emoji-filter/dist/emoji.min.css'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('vendor_styles.css'))
        .pipe(minifyCss())
        .pipe(rev())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/assets'));

    var templates = gulp.src(['build/modules/*.js'], {base: 'build'})
        .pipe(sourcemaps.init())
        .pipe(concat('templates.js'))
        .pipe(uglify())
        .pipe(rev())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/assets'));

    var scripts = gulp.src(['app/**/*.ts', 'app/modules/*.ts'])
        .pipe(sourcemaps.init())
        .pipe(typescript(typeScriptOptions))
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(rev())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/assets'));

    var styles = gulp.src(['assets/less/styles.less', 'app/**/*.less'])
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(concat('styles.css'))
        .pipe(minifyCss())
        .pipe(rev())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/assets'));

    return merge(vendorScripts, vendorStyles, templates, scripts, styles)
        .pipe(rev.manifest())
        .pipe(gulp.dest('build'));
});

gulp.task('replace', ['assets', 'copy'], function () {
    return gulp.src(['build/*.json', 'build/views/*.html'])
        .pipe(revCollector({
            dirReplacements: {
                assets: function (path) {
                    return '../assets/' + path;
                }
            }
        }))
        .pipe(gulp.dest('build/views'));
});

gulp.task('manifest', ['clean'], function () {
    var replacePaths = function (content) {
        var manifest = JSON.parse(content);
        var regex = /^build\//;
        manifest.background.page = manifest.background.page.replace(regex, '');
        manifest.options_page = manifest.options_page.replace(regex, '');
        manifest.browser_action.default_popup = manifest.browser_action.default_popup.replace(regex, '');

        return JSON.stringify(manifest, null, 2);
    };

    return gulp.src('manifest.json')
        .pipe(change(replacePaths))
        .pipe(gulp.dest('build'));
});

gulp.task('crx', ['manifest', 'replace'], function () {
    var fs = require('fs');
    var manifest = require('./manifest.json');

    return gulp.src('build')
        .pipe(crx({
            privateKey: fs.readFileSync(process.env.CRX_PEM_PATH || '../bbnotifier.pem'),
            filename: 'bitbucket-notifier-chrome.crx',
            codebase: manifest.update_url,
            updateXmlFilename: 'update.xml'
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('test:prepare', ['clean'], function () {
    var compileSources = gulp.src(['app/**/*.ts', 'test/**/*.ts'], {base: '.'})
        .pipe(typescript(typeScriptOptions))
        .pipe(gulp.dest('build'));
    var copyResources = gulp.src(['app/views/*.html', 'app/components/**/*.html'], {base: '.'})
        .pipe(gulp.dest('build'));

    return merge(compileSources, copyResources);
});

gulp.task('test', ['test:prepare'], function (done) {
    new karmaServer({
        configFile: __dirname + '/karma.conf.js'
    }, done).start();
});
