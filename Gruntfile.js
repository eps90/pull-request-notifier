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

    grunt.initConfig({
        typescript: {
            dist: {
                src: ['app/modules/bitbucket_notifier.ts'],
                dest: 'dist',
                options: {
                    target: "es5",
                    basepath: ".",
                    sourceMap: true
                }
            },
            test: {
                src: ['test/**/*.ts', 'app/modules/bitbucket_notifier.ts'],
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
                files: ['app/**/*.ts', 'app/**/*.css', 'app/**/*.html'],
                tasks: ['dist']
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
                module: 'bitbucketNotifier',
                options: {
                    url: function (templateUrl) {
                        return templateUrl.replace(/^app/, '..');
                    }
                }
            }
        },
        filerev: {
            dist: {
                src: ['dist/scripts/*.js', 'dist/styles/*.css']
            }
        },
        useminPrepare: {
            html: 'app/views/*.html',
            options: {
                dest: 'dist/views'
            }
        },
        usemin: {
            html: 'dist/views/popup.html'
        }
    });

    grunt.registerTask('dist', ['clean:dist', 'typescript:dist', 'copy:dist']);
    grunt.registerTask('test', ['clean:test', 'typescript:test', 'copy:test', 'karma']);
    grunt.registerTask('default', ['dist', 'watch:dist']);
};
