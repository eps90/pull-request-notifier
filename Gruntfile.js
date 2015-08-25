var path = require('path');

// @todo Think about stages naming (dist and test)
// @todo Import typescript sourcemaps when minifying/uglifying
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-filerev');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-tslint');

    grunt.initConfig({
        typescript: {
            dist: {
                src: ['app/modules/*.ts'],
                dest: 'dist',
                options: {
                    target: "es5",
                    basepath: ".",
                    sourceMap: true
                }
            },
            test: {
                src: ['test/**/*.ts', 'app/modules/*.ts'],
                dest: 'build',
                options: {
                    target: "es5",
                    basepath: ".",
                    sourceMap: true
                }
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        src: ['views/*.html', 'components/**/*.html'],
                        dest: 'dist',
                        cwd: 'app'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['bower_components/bootstrap/fonts/*.*', 'bower_components/fontawesome/fonts/*.*'],
                        dest: 'dist/fonts'
                    }
                ]
            },
            test: {
                files: [
                    {
                        expand: true,
                        src: ['app/views/*.html', 'app/components/**/*.html'],
                        dest: 'build'
                    }
                ]
            }
        },
        clean: {
            dist: {
                src: ['dist']
            },
            test: {
                src: ['build']
            }
        },
        watch: {
            dist: {
                files: ['app/**/*.ts', 'app/**/*.css', 'app/**/*.html', 'assets/**/*.less', 'app/**/*.less'],
                tasks: ['build']
            }
        },
        karma: {
            unit: {
                options: {
                    configFile: 'karma.conf.js'
                }
            }
        },
        ngtemplates: {
            dist: {
                src: 'app/components/**/*.html',
                dest: 'dist/modules/templates.js',
                options: {
                    url: function (templateUrl) {
                        return templateUrl.replace(/^app/, '..');
                    },
                    module: 'bitbucketNotifier'
                }
            }
        },
        filerev: {
            dist: {
                src: ['dist/scripts/*.js', 'dist/styles/*.css']
            }
        },
        useminPrepare: {
            dist:{
                src: ['app/views/*.html']
            },
            options: {
                dest: 'dist/views',
                flow: {
                    steps: {
                        js: ['concat', 'uglify'],
                        css: ['concat', 'cssmin'],
                        'less': [{
                            name: 'less',
                            createConfig: lessCreateConfig
                        }]
                    },
                    post: {}
                }
            }
        },
        usemin: {
            html: 'dist/views/*.html',
            options: {
                blockReplacements: {
                    less: function (block) {
                        return '<link rel="stylesheet" href="' + block.dest + '" />';
                    }
                }
            }
        },
        tslint: {
            options: {
                configuration: grunt.file.readJSON("tslint.json")
            },
            files: {
                src: ['app/**/*.ts', 'test/**/*.ts']
            }
        }
    });

    grunt.registerTask('dist', ['clean:dist', 'typescript:dist', 'copy:dist']);
    grunt.registerTask('test', ['clean:test', 'typescript:test', 'copy:test', 'karma']);
    grunt.registerTask('default', ['build', 'watch:dist']);
    grunt.registerTask('build', [
        'dist',
        'useminPrepare',
        'ngtemplates:dist',
        'less:generated',
        'concat:generated',
        'uglify:generated',
        'cssmin:generated',
        'filerev',
        'usemin'
    ]);

    function lessCreateConfig(context, block) {
        var cfg = {files: []},
            outfile = path.join(context.outDir, block.dest),
            filesDef = {};

        filesDef.dest = outfile;
        filesDef.src = [];

        context.inFiles.forEach(function (inFile) {
            filesDef.src.push(path.join(context.inDir, inFile));
        });

        cfg.files.push(filesDef);
        context.outFiles = [block.dest];
        return cfg;
    }
};
