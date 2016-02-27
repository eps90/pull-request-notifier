module.exports.register = function (Handlebars) {
    var manifestFile = require('../../../build/assets-manifest.json');

    function getAssetName(assetName) {
        return 'assets/' + assetName.replace('^assets/', '');
    }

    function getAsset(type, assetName) {
        assetName = getAssetName(assetName);
        if (manifestFile.hasOwnProperty(assetName) && manifestFile[assetName].hasOwnProperty(type)) {
            return new Handlebars.SafeString(manifestFile[assetName][type]);
        }

        throw new Error('Asset ' + assetName + ' not found!');
    }

    Handlebars.registerHelper('js', function (assetName) {
        return getAsset('scripts', assetName);
    });

    Handlebars.registerHelper('css', function (assetName) {
        return getAsset('styles', assetName);
    });
};
