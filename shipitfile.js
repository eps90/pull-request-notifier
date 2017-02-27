var _ = require('lodash');
var localConfig;

try {
    localConfig = require('./shipitfile.local.js') || {};
} catch (e) {
    localConfig = {};
}

var config = _.merge({
    default: {
        workspace: '/tmp/bitbucket-notifier-chrome',
        deployTo: '/tmp/bitbucket-notifier-chrome-dist',
        dirToCopy: 'dist',
        repositoryUrl: 'git@bitbucket.org:dacsoftware/bitbucket-notifier-chrome-extension.git',
        ignores: ['.git', 'node_modules'],
        keepReleases: 3
    },
    production: {
        servers: 'deployer@127.0.0.1'
    }
}, localConfig);

module.exports = {
    config: config,
    options: {
        run: 'deploy',
        init: function (shipIt) {
            require('shipit-deploy')(shipIt);
            shipIt.blTask('deploy:install', function () {
                return shipIt.local('npm install', {cwd: this.config.workspace});
            });

            shipIt.blTask('deploy:compile', function () {
                return shipIt.local('gulp pack', {cwd: this.config.workspace});
            });

            shipIt.on('fetched', function () {
                return shipIt.start('deploy:install', 'deploy:compile');
            });
        }
    }
};
