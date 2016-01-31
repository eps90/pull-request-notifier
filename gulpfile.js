var gulp = require('gulp');
var del = require('del');
var typescript = require('gulp-typescript');
var karmaServer = require('karma').Server;
var merge = require('merge-stream');
var flatten = require('gulp-flatten');
var gutil = require('gulp-util');
var debug = require('gulp-debug');
var order = require('gulp-order');
var gulpIf = require('gulp-if');

var minifyCss = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var less = require('gulp-less');

var ngTemplates = require('gulp-ng-templates');

gulp.task('clean:test', function () {
    return del(['build/*', 'build']);
});

gulp.task('clean:dist', function () {
    return del(['build/*', 'build', 'dist/*', 'dist']);
});

gulp.task('compile:test', ['clean:test'], function () {
    var options = {
        target: 'es5',
        module: 'commonjs'
    };

    return gulp.src(['app/**/*.ts', 'test/**/*.ts'], {base: '.'})
        .pipe(typescript(options))
        .pipe(gulp.dest('build'));
});

gulp.task('compile:dist', ['clean:dist'], function () {
    var options = {
        target: 'es5',
        module: 'commonjs'
    };

    return gulp.src(['app/**/*.ts'], {base: 'app'})
        .pipe(typescript(options))
        .pipe(gulp.dest('build'));
});

gulp.task('copy:test', ['clean:test'], function () {
    return gulp.src(['app/views/*.html', 'app/components/**/*.html'], {base: ''})
        .pipe(gulp.dest('build'));
});

gulp.task('copy:dist', ['clean:dist'], function () {
    var templates = gulp.src(['app/views/*.html', 'app/components/**/*.html'], {base: 'app'})
        .pipe(gulp.dest('build'));
    var fonts = gulp.src(['bower_components/bootstrap/fonts/*.*', 'bower_components/fontawesome/fonts/*.*'], {base: '.'})
        .pipe(flatten())
        .pipe(gulp.dest('build/fonts'));

    return merge(templates, fonts);
});

gulp.task('ngTemplates', ['copy:dist'], function () {
    var popup = gulp.src(['app/components/**/*.html'])
        .pipe(ngTemplates({
            filename: 'templates.js',
            module: 'bitbucketNotifier',
            standalone: false,
            path: function (path) {
                return path.replace(/(.+)\/app/, '..');
            }
        }))
        .pipe(gulp.dest('build/modules'));

    var options = gulp.src(['app/components/**/*.html'])
        .pipe(ngTemplates({
            filename: 'templates_options_module.js',
            module: 'bitbucketNotifer.options',
            standalone: false,
            path: function (path) {
                return path.replace(/(.+)\/app/, '..');
            }
        }))
        .pipe(gulp.dest('build/modules'));

    return merge(popup, options);
});

gulp.task('assets', ['clean:dist', 'copy:dist', 'ngTemplates'], function () {
    var tsOptions = {
        target: 'es5',
        module: 'commonjs',
        typescript: require('typescript'),
        sortOutput: true
    };

    var scripts = gulp.src(['build/modules/*.js', 'app/**/*.ts'])
        .pipe(gulpIf(/\.ts$/, typescript(tsOptions)))
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('build/assets'));

    var styles = gulp.src(['assets/less/styles.less', 'app/**/*.less'])
        .pipe(less())
        .pipe(concat('styles.css'))
        .pipe(minifyCss())
        .pipe(rev())
        .pipe(gulp.dest('build/assets'));

    return merge(scripts, styles)
        .pipe(debug())
        .pipe(rev.manifest({base: '.'}))
        .pipe(gulp.dest('build'));
});

gulp.task('build:test', ['compile:test', 'copy:test']);
gulp.task('build:dist', ['compile:dist', 'copy:dist']);

gulp.task('test', ['build:test'], function (done) {
    new karmaServer({
        configFile: __dirname + '/karma.conf.js'
    }, done).start();
});
