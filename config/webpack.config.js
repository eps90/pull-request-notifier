const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (function webpackConfig() {
    const isProd = process.env.npm_lifecycle_event === 'build:prod';
    const isTest = process.env.npm_lifecycle_event === 'test';

    const config = {
        entry: isTest ? void 0 : {
            popup: path.resolve(__dirname, '../app/modules/bitbucket_notifier.ts'),
            background: path.resolve(__dirname, '../app/modules/bitbucket_notifier_background.ts'),
            options: path.resolve(__dirname, '../app/modules/bitbucket_notifier_options.ts')
        },

        output: isTest ? {} : {
            path: path.resolve(__dirname, '../dist'),
            filename: '[name].[hash].js',
            publicPath: '/',
            chunkFilename: '[name].[hash].js'
        },

        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: 'ts-loader'
                },
                {
                    test: /\.html$/,
                    use: {
                        loader: 'html-loader',
                        options: {
                            exportAsEs6Default: true
                        }
                    }
                },
                {
                    test: /\.less$/,
                    use: ExtractTextPlugin.extract({
                        use: ['css-loader', 'less-loader']
                    })
                }
            ]
        },

        resolve: {
            extensions: ['.ts', '.js']
        },

        plugins: [
            new webpack.ProvidePlugin({
                'window.jQuery': 'jquery'
            })
        ]
    };

    if (isTest) {
        config.devtool = 'inline-source-map';
    } else if (isProd) {
        config.devtool = 'source-map';
    } else {
        config.devtool = 'eval-source-map';
    }

    if (isProd) {
        config.plugins.push(
            new webpack.optimize.CommonsChunkPlugin({
                name: 'common'
            })
        );
        config.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true
            })
        );
    }

    if (!isTest) {
        config.plugins.push(
            new ExtractTextPlugin('css/[name].css')
        )
    }

    return config;
})();
