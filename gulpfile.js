var gulp = require('gulp');
require('gulp-stats')(gulp);

gulp.task('clean', function () {
    var del = require('del');
    return del(['build/*', 'build', 'dist/*', 'dist']);
});

gulp.task('ngTemplates', ['clean'], function () {
    var htmlmin = require('gulp-htmlmin'),
        ngTemplates = require('gulp-ng-templates'),
        merge = require('merge-stream');

    var popup = gulp.src(['app/components/**/*.html'])
        .pipe(htmlmin({collapseWhitespace: true}))
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
        .pipe(htmlmin({collapseWhitespace: true}))
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

gulp.task('assets', ['clean', 'ngTemplates'], function () {
    var bundle = require('gulp-bundle-assets');

    return gulp.src('./bundle.conf.js')
        .pipe(bundle({base: '.'}))
        .pipe(bundle.results({
            fileName: 'assets-manifest',
            dest: 'build',
            pathPrefix: '/'
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('views', ['assets'], function () {
    var hb = require('gulp-hb');

    return gulp.src('app/views/*.html')
        .pipe(hb({
            helpers: 'app/views/helpers/*.js'
        }))
        .pipe(gulp.dest('build/views'));
});

gulp.task('manifest', ['clean'], function () {
    var change = require('gulp-change');
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

gulp.task('build', ['views', 'manifest']);

gulp.task('pack', ['build'], function () {
    var crx = require('gulp-crx-pack'),
        merge = require('merge-stream'),
        zip = require('gulp-zip'),
        fs = require('fs'),
        url = require('url'),
        manifest = require('./manifest.json'),
        targetCrxFilename = 'bitbucket-notifier-chrome.crx',
        targetZipFileName = 'bitbucket-notifier-chrome.zip';

    var updateUrlParts = url.parse(manifest.update_url);
    var codeBase = url.resolve(
        url.format({
            protocol: updateUrlParts.protocol,
            host: updateUrlParts.host
        }),
        '/' + targetCrxFilename
    );

    var crxPipeline = gulp.src('build')
        .pipe(crx({
            privateKey: fs.readFileSync(process.env.CRX_PEM_PATH || '../bbnotifier.pem'),
            filename: 'bitbucket-notifier-chrome.crx',
            codebase: codeBase,
            updateXmlFilename: 'update.xml'
        }))
        .pipe(gulp.dest('dist'));

    var zipPipeline = gulp.src('build/**/*')
        .pipe(zip(targetZipFileName))
        .pipe(gulp.dest('dist'));

    return merge(crxPipeline, zipPipeline);
});

gulp.task('test:prepare', ['clean'], function () {
    var typescript = require('gulp-typescript'),
        merge = require('merge-stream'),
        typeScriptOptions = {
            target: 'es5',
            module: 'commonjs',
            typescript: require('typescript')
        };

    var compileSources = gulp.src(['app/**/*.ts', 'test/**/*.ts'], {base: '.'})
        .pipe(typescript(typeScriptOptions))
        .pipe(gulp.dest('build'));
    var copyResources = gulp.src(['app/views/*.html', 'app/components/**/*.html'], {base: '.'})
        .pipe(gulp.dest('build'));

    return merge(compileSources, copyResources);
});

gulp.task('test', ['test:prepare'], function (done) {
    var karmaServer = require('karma').Server;

    return new karmaServer({
        configFile: __dirname + '/karma.conf.js'
    }, done).start();
});

gulp.task('deploy', function (cb) {
    var shipitfile = require('./shipitfile.js');
    var config = shipitfile.config;
    var options = shipitfile.options;

    var shipItCaptain = require('shipit-captain');
    shipItCaptain(config, options, cb);
});

gulp.task('release', function () {
    var bump = require('gulp-bump'),
        git = require('gulp-git'),
        filter = require('gulp-filter'),
        tagVersion = require('gulp-tag-version'),
        argv = require('yargs').argv;

    return gulp.src(['./bower.json', './package.json', './manifest.json'])
        .pipe(bump({type: argv.type || 'patch'}))
        .pipe(gulp.dest('./'))
        .pipe(git.commit("RELEASE"))
        .pipe(filter('package.json'))
        .pipe(tagVersion());
});

gulp.task('default', ['build']);