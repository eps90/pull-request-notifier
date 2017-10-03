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
        dirToCopy: 'build',
        repositoryUrl: 'git@bitbucket.org:eps90/pull-request-notifier.git',
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
                return shipIt.local('TMPDIR=/tmp yarn install', {cwd: this.config.workspace});
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
