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
    grunt.loadNpmTasks('grunt-crx');

    grunt.initConfig({
        typescript: {
            build: {
                src: ['app/modules/*.ts'],
                dest: 'build',
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
            build: {
                files: [
                    {
                        expand: true,
                        src: ['views/*.html', 'components/**/*.html'],
                        dest: 'build',
                        cwd: 'app'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['bower_components/bootstrap/fonts/*.*', 'bower_components/fontawesome/fonts/*.*'],
                        dest: 'build/fonts'
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
            },
            dist: {
                files: [
                    {
                        expand: true,
                        src: ['views/*.html', 'scripts/*.js', 'fonts/*', 'styles/*.css'],
                        dest: 'dist/dist',
                        cwd: 'build'
                    },
                    {
                        expand: true,
                        src: ['manifest.json', 'assets/img/*.png'],
                        dest: 'dist',
                        cwd: '.'
                    }
                ]
            }
        },
        clean: {
            build: {
                src: ['dist', 'build']
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
            popup: {
                src: 'app/components/**/*.html',
                dest: 'build/modules/templates.js',
                options: {
                    url: function (templateUrl) {
                        return templateUrl.replace(/^app/, '..');
                    },
                    module: 'bitbucketNotifier'
                }
            },
            options_module: {
                src: 'app/components/**/*.html',
                dest: 'build/modules/templates_options_module.js',
                options: {
                    url: function (templateUrl) {
                        return templateUrl.replace(/^app/, '..');
                    },
                    module: 'bitbucketNotifier.options'
                }
            }
        },
        filerev: {
            build: {
                src: ['build/scripts/*.js', 'build/styles/*.css']
            }
        },
        useminPrepare: {
            build:{
                src: ['app/views/*.html']
            },
            options: {
                dest: 'build/views',
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
            html: 'build/views/*.html',
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
        },
        crx: {
            dist: {
                src: ['dist/**/*'],
                dest: 'dist/pkg.crx',
                options: {
                    // @todo Find more efficient way to load the key
                    //privateKey: '../bitbucket-notifier-chrome.pem'
                }
            }
        }
    });

    grunt.registerTask('update:manifest', function () {
        var file = 'dist/manifest.json';
        var contents = grunt.file.readJSON(file);
        contents.background.page = 'dist/views/background.html';
        contents.options_page = 'dist/views/options.html';
        contents.browser_action.default_popup = 'dist/views/popup.html';
        grunt.file.write(file, JSON.stringify(contents, null, 2))
    });

    grunt.registerTask('dist', ['clean:build', 'typescript:build', 'copy:build']);
    grunt.registerTask('test', ['clean:test', 'typescript:test', 'copy:test', 'karma']);
    grunt.registerTask('default', ['build', 'watch:dist']);
    grunt.registerTask('build', [
        'dist',
        'useminPrepare',
        'ngtemplates',
        'less:generated',
        'concat:generated',
        'uglify:generated',
        'cssmin:generated',
        'filerev',
        'usemin',
        'copy:dist',
        'update:manifest',
        'crx:dist'
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
