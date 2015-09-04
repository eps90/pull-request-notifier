var path = require('path');
var builder = require('xmlbuilder');
var fs = require('fs');
var NodeRSA = require('node-rsa');
var crypto = require('crypto');

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
    grunt.loadNpmTasks('grunt-shipit');
    grunt.loadNpmTasks('shipit-deploy');

    grunt.initConfig({
        project: {
            appName: require('./bower.json').name,
            appVersion: require('./manifest.json').version,
            buildDir: 'build',
            distDir: 'dist',
            // @todo To change
            privateKeyPath: process.env.CRX_PEM_PATH || '../bitbucket-notifier-chrome.pem',
            // @todo To change
            destinationPackageServer: 'http://bitbucket-notifier.kubaturek.pl',
            destinationPackagePath: '<%= project.distDir %>/<%= project.appName %>.crx',
            updateXmlPath: '<%= project.distDir %>/update.xml'
        },

        typescript: {
            build: {
                src: ['app/modules/*.ts'],
                dest: '<%= project.buildDir %>',
                options: {
                    target: "es5",
                    basepath: ".",
                    sourceMap: true
                }
            },
            test: {
                src: ['test/**/*.ts', 'app/modules/*.ts'],
                dest: '<%= project.buildDir %>',
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
                        dest: '<%= project.buildDir %>',
                        cwd: 'app'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['bower_components/bootstrap/fonts/*.*', 'bower_components/fontawesome/fonts/*.*'],
                        dest: '<%= project.buildDir %>/fonts'
                    }
                ]
            },
            test: {
                files: [
                    {
                        expand: true,
                        src: ['app/views/*.html', 'app/components/**/*.html'],
                        dest: '<%= project.buildDir %>'
                    }
                ]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        src: ['views/*.html', 'scripts/*.js', 'fonts/*', 'styles/*.css'],
                        dest: '<%= project.distDir %>/dist',
                        cwd: '<%= project.buildDir %>'
                    },
                    {
                        expand: true,
                        src: ['manifest.json', 'assets/img/*.png'],
                        dest: '<%= project.distDir %>',
                        cwd: '.'
                    }
                ]
            }
        },
        clean: {
            build: {
                src: ['<%= project.distDir %>', '<%= project.buildDir %>']
            },
            test: {
                src: ['<%= project.buildDir %>']
            },
            dist: {
                src: ['<%= project.distDir %>/assets', '<%= project.distDir %>/dist', '<%= project.distDir %>/manifest.json']
            }
        },
        watch: {
            dist: {
                files: ['app/**/*.ts', 'app/**/*.css', 'app/**/*.html', 'assets/**/*.less', 'app/**/*.less'],
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
            popup: {
                src: 'app/components/**/*.html',
                dest: '<%= project.buildDir %>/modules/templates.js',
                options: {
                    url: function (templateUrl) {
                        return templateUrl.replace(/^app/, '..');
                    },
                    module: 'bitbucketNotifier'
                }
            },
            options_module: {
                src: 'app/components/**/*.html',
                dest: '<%= project.buildDir %>/modules/templates_options_module.js',
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
                src: ['<%= project.buildDir %>/scripts/*.js', '<%= project.buildDir %>/styles/*.css']
            }
        },
        useminPrepare: {
            build:{
                src: ['app/views/*.html']
            },
            options: {
                dest: '<%= project.buildDir %>/views',
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
            html: '<%= project.buildDir %>/views/*.html',
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
                src: ['<%= project.distDir %>/**/*'],
                dest: '<%= project.destinationPackagePath %>',
                options: {
                    // @todo Find more efficient way to load the key
                    privateKey: '<%= project.privateKeyPath %>'
                }
            }
        },
        shipit: {
            options: {
                workspace: '/tmp/bitbucket-notifier-chrome',
                deployTo: '/tmp/bitbucket-notifier-chrome',
                dirToCopy: 'dist',
                repositoryUrl: 'git@bitbucket.org:dacsoftware/bitbucket-notifier-chrome-extension.git',
                ignores: ['.git', 'node_modules'],
                keepReleases: 3
            },
            staging: {
                servers: 'root@127.0.0.1'
            }
        }
    });


    grunt.registerTask('deploy:install', function () {
        grunt.shipit.local('npm install', {cwd: grunt.shipit.config.workspace}, this.async());
    });

    grunt.registerTask('deploy:compile', function () {
        grunt.shipit.local('grunt build', {cwd: grunt.shipit.config.workspace}, this.async());
    });

    grunt.shipit.on('fetched', function () {
        grunt.task.run(['deploy:install', 'deploy:compile']);
    });

    grunt.registerTask('update:manifest', function () {
        var file = 'dist/manifest.json';
        var contents = grunt.file.readJSON(file);
        contents.background.page = grunt.config.get('project.distDir') + '/views/background.html';
        contents.options_page = grunt.config.get('project.distDir') + '/views/options.html';
        contents.browser_action.default_popup = 'dist/views/popup.html';
        grunt.file.write(file, JSON.stringify(contents, null, 2))
    });

    grunt.registerTask('update:xml', function () {
        var appId = getExtensionId(grunt.config.get('project.privateKeyPath'));
        var updateServer = grunt.config.get('project.destinationPackageServer') + '/' + grunt.config.get('project.appName') + '.crx';
        var appVersion = grunt.config.get('project.appVersion');
        var destinationXml = grunt.config.get('project.updateXmlPath');
        var xml = builder.create({
                gupdate: {
                    '@xmlns': 'http://www.google.com/update2/response',
                    '@protocol': '2.0',
                    app: {
                        '@appid': appId,
                        updatecheck: {
                            '@codebase': updateServer,
                            '@version': appVersion
                        }
                    }
                }
            }).end({ pretty: true });

        fs.writeFileSync(destinationXml, xml);
        grunt.log.ok('Update manifest XML created');
    });

    grunt.registerTask('dist', [
        'clean:build',
        'typescript:build',
        'copy:build',
        'useminPrepare',
        'ngtemplates',
        'less:generated',
        'concat:generated',
        'uglify:generated',
        'cssmin:generated',
        'filerev',
        'usemin'
    ]);
    grunt.registerTask('test', ['clean:test', 'typescript:test', 'copy:test', 'karma']);
    grunt.registerTask('default', ['dist', 'watch:dist']);
    grunt.registerTask('build', [
        'dist',
        'copy:dist',
        'update:manifest',
        'crx:dist',
        'update:xml',
        'clean:dist'
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

    function getExtensionId(privateKeyPath) {
        var key = new NodeRSA(fs.readFileSync(privateKeyPath));
        var derred = key.exportKey('pkcs8-public-der');
        var hashed = crypto.createHash('sha256').update(derred).digest('hex');
        var letters = hashed.split("");
        var result = letters.map(function(letter) {
            var charCode = parseInt(letter, 16);
            return String.fromCharCode(charCode + 97);
        });

        return result.join('').substring(0, 32);
    }
};
