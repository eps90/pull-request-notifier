var gulp = require('gulp');
var del = require('del');
var typescript = require('gulp-typescript');
var karmaServer = require('karma').Server;

gulp.task('clean:test', function () {
    return del(['build/*', 'build']);
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

gulp.task('copy:test', ['clean:test'], function () {
    return gulp.src(['app/views/*.html', 'app/components/**/*.html'], {base: '.'})
        .pipe(gulp.dest('build'));
});

gulp.task('build:test', ['compile:test', 'copy:test']);

gulp.task('test', ['build:test'], function (done) {
    new karmaServer({
        configFile: __dirname + '/karma.conf.js'
    }, done).start();
});
