const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLinkWebpackPlugin = require('stylelint-webpack-plugin');
const DotEnvPlugin = require('dotenv-webpack');

module.exports = (function webpackConfig() {
    const isProd = process.env.npm_lifecycle_event === 'build:prod';
    const isTest = process.env.npm_lifecycle_event.substr(0, 4) === 'test';
    const isDev = !isTest && !isProd;

    const config = {
        entry: isTest ? void 0 : {
            popup: [
                path.resolve(__dirname, '../assets/less/styles.less'),
                path.resolve(__dirname, '../app/modules/bitbucket_notifier.ts')
            ],
            background: path.resolve(__dirname, '../app/modules/bitbucket_notifier_background.ts'),
            options: [
                path.resolve(__dirname, '../assets/less/styles.less'),
                path.resolve(__dirname, '../app/modules/bitbucket_notifier_options.ts')
            ],
            vendor_styles: path.resolve(__dirname, '../app/vendor_styles.ts'),
            vendor: path.resolve(__dirname, '../app/vendor.ts')
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
                    test: /\.(png|jpg|jpeg|gif|svg)$/,
                    include: path.resolve(__dirname, '../assets/img'),
                    use: {
                        loader: 'url-loader'
                    }
                },
                {
                    test: /\.(png|jpg|jpeg|gif|svg)$/,
                    exclude: path.resolve(__dirname, '../assets/img'),
                    use: {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'img/'
                        }
                    }
                },
                {
                    test: /\.(woff|woff2|ttf|eot)$/,
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
            new DotEnvPlugin({
                path: path.resolve(__dirname, '../.env')
            }),
            new webpack.ProvidePlugin({
                'window.jQuery': 'jquery'
            }),
            new webpack.DefinePlugin({
                PRODUCTION: JSON.stringify(isProd)
            })
        ],

        "stats": "normal"
    };

    if (isDev) {
        config.module.rules.push(
            {
                test: /\.ts$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                options: {
                    emitErrors: true,
                    failOnHint: true
                }
            }
        );
        config.plugins.push(
            new StyleLinkWebpackPlugin({
                context: 'app',
                failOnError: true
            })
        )
    }

    if (isTest) {
        config.devtool = 'inline-source-map';
    } else if (isProd) {
        config.devtool = 'source-map';
    } else {
        config.devtool = 'source-map';
    }

    if (isProd || isDev) {
        config.plugins.push(
            new webpack.optimize.CommonsChunkPlugin({
                name: 'common'
            }),
            new HtmlWebpackPlugin({
                filename: 'background.html',
                template: path.resolve(__dirname, '../app/views/background.html'),
                chunksSortMode: 'manual',
                chunks: ['common', 'vendor', 'background']
            }),
            new HtmlWebpackPlugin({
                filename: 'popup.html',
                template: path.resolve(__dirname, '../app/views/popup.html'),
                chunksSortMode: 'manual',
                chunks: ['common', 'vendor_styles', 'vendor', 'popup']
            }),
            new HtmlWebpackPlugin({
                filename: 'options.html',
                template: path.resolve(__dirname, '../app/views/options.html'),
                chunksSortMode: 'manual',
                chunks: ['common', 'vendor_styles', 'vendor', 'options']
            })
        )
    }

    if (isProd) {
        config.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true
            })
        );
    }

    if (!isTest) {
        config.plugins.push(
            new ExtractTextPlugin('css/[name].[contenthash].css')
        )
    }

    if (isDev) {
        config.devServer = {
            contentBase: path.resolve(__dirname, '../dist')
        };
    }

    return config;
})();
