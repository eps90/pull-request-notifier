const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (function webpackConfig() {
    const isProd = process.env.npm_lifecycle_event === 'build:prod';
    const isTest = process.env.npm_lifecycle_event === 'test';
    const isDev = !isTest && !isProd;

    const config = {
        entry: isTest ? void 0 : {
            vendor_styles: path.resolve(__dirname, '../app/vendor_styles.ts'),
            vendor: path.resolve(__dirname, '../app/vendor.ts'),
            popup: path.resolve(__dirname, '../app/modules/bitbucket_notifier.ts'),
            background: path.resolve(__dirname, '../app/modules/bitbucket_notifier_background.ts'),
            options: path.resolve(__dirname, '../app/modules/bitbucket_notifier_options.ts')
        },

        output: isTest ? {} : {
            path: path.resolve(__dirname, '../dist'),
            filename: '[name].[chunkhash].js',
            publicPath: '/',
            chunkFilename: '[name].[chunkhash].js'
        },

        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: {
                        loader: 'ts-loader',
                        options: {
                            silent: true
                        }
                    }
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
                    test: /\.css$/,
                    use: isTest ? 'null-loader' : ExtractTextPlugin.extract({
                        use: ['css-loader']
                    })
                },
                {
                    test: /\.less$/,
                    use: isTest ? 'null-loader' : ExtractTextPlugin.extract({
                        use: ['css-loader', 'less-loader']
                    })
                },
                {
                    test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'fonts/'
                        }
                    }
                },
                {
                    test: /\.ogg$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'sounds/'
                        }
                    }
                }
            ]
        },

        resolve: {
            extensions: ['.ts', '.js']
        },

        plugins: [
            new webpack.ProvidePlugin({
                'window.jQuery': 'jquery',
                'window.createjs': 'createjs-soundjs'
            })
        ]
    };

    if (isTest) {
        config.devtool = 'inline-source-map';
    } else if (isProd) {
        config.devtool = 'source-map';
    } else {
        config.devtool = 'source-map';
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

    if (isProd || isDev) {
        config.plugins.push(
            new HtmlWebpackPlugin({
                filename: 'background.html',
                template: path.resolve(__dirname, '../app/views/background.html'),
                chunksSortMode: 'manual',
                chunks: ['vendor', 'common', 'background']
            }),
            new HtmlWebpackPlugin({
                filename: 'popup.html',
                template: path.resolve(__dirname, '../app/views/popup.html'),
                chunksSortMode: 'manual',
                chunks: ['vendor_styles', 'vendor', 'common', 'popup']
            }),
            new HtmlWebpackPlugin({
                filename: 'options.html',
                template: path.resolve(__dirname, '../app/views/options.html'),
                chunksSortMode: 'manual',
                chunks: ['vendor_styles', 'vendor', 'common', 'options']
            })
        )
    }

    if (!isTest) {
        config.plugins.push(
            new ExtractTextPlugin('css/[name].[contenthash].css')
        )
    }

    return config;
})();
