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

gulp.task('crx', ['build'], function () {
    var crx = require('gulp-crx-pack'),
        fs = require('fs'),
        manifest = require('./manifest.json');

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
    var typescript = require('gulp-typescript'),
        merge = require('merge-stream'),
        typeScriptOptions = {
            target: 'es5',
            module: 'commonjs',
            typescript: require('typescript'),
            sortOutput: true
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
