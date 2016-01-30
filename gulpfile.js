var gulp = require('gulp');
var del = require('del');
var typescript = require('gulp-typescript');
var karmaServer = require('karma').Server;
var merge = require('merge-stream');
var flatten = require('gulp-flatten');

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

gulp.task('build:test', ['compile:test', 'copy:test']);
gulp.task('build:dist', ['compile:dist', 'copy:dist']);

gulp.task('test', ['build:test'], function (done) {
    new karmaServer({
        configFile: __dirname + '/karma.conf.js'
    }, done).start();
});
