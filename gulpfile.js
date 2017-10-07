const gulp = require('gulp');
require('gulp-stats')(gulp);

gulp.task('copy-img', function ()  {
    "use strict";
    gulp.src([
        'assets/img/bitbucket_logo.png',
        'assets/img/icon128.png',
        'assets/img/icon64.png',
        'assets/img/icon48.png',
        'assets/img/icon32.png',
    ])
        .pipe(gulp.dest('dist/img'));
});

gulp.task('manifest', ['copy-img'], function () {
    gulp.src('manifest.json')
        .pipe(gulp.dest('dist'));
});

gulp.task('zip', ['manifest'], function () {
    "use strict";
    const zip = require('gulp-zip');
    const targetZipFileName = 'pull-request-notifier.zip';

    return gulp.src('dist/**/*')
        .pipe(zip(targetZipFileName))
        .pipe(gulp.dest('build'));
});

gulp.task('crx', ['manifest', 'zip'], function () {
    const crx = require('gulp-crx-pack'),
        fs = require('fs'),
        url = require('url'),
        manifest = require('./manifest.json'),
        targetCrxFilename = 'pull-request-notifier.crx';

    const updateUrlParts = url.parse(manifest.update_url || '');
    const codeBase = url.resolve(
        url.format({
            protocol: updateUrlParts.protocol,
            host: updateUrlParts.host
        }),
        '/' + targetCrxFilename
    );

    return gulp.src('dist')
        .pipe(crx({
            privateKey: fs.readFileSync(process.env.CRX_PEM_PATH || '../bbnotifier.pem'),
            filename: 'pull-request-notifier.crx',
            codebase: codeBase,
            updateXmlFilename: 'update.xml'
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('deploy', function (cb) {
    const shipitfile = require('./shipitfile.js');
    const config = shipitfile.config;
    const options = shipitfile.options;

    const shipItCaptain = require('shipit-captain');
    shipItCaptain(config, options, cb);
});

gulp.task('release', function () {
    const bump = require('gulp-bump'),
        git = require('gulp-git'),
        filter = require('gulp-filter'),
        tagVersion = require('gulp-tag-version'),
        argv = require('yargs').argv;

    return gulp.src(['./package.json', './manifest.json'])
        .pipe(bump({type: argv.type || 'patch'}))
        .pipe(gulp.dest('./'))
        .pipe(git.commit("RELEASE"))
        .pipe(filter('package.json'))
        .pipe(tagVersion());
});

gulp.task('default', ['build']);
