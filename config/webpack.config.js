const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        popup: path.resolve(__dirname, '../app/modules/bitbucket_notifier.ts'),
        background: path.resolve(__dirname, '../app/modules/bitbucket_notifier_background.ts'),
        options: path.resolve(__dirname, '../app/modules/bitbucket_notifier_options.ts')
    },

    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].[hash].js',
        publicPath: '/',
        chunkFilename: '[name].[hash].js'
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                include: [
                    path.resolve(__dirname, '../app')
                ]
            },
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        exportAsEs6Default: true
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
            'window.jQuery': 'jquery'
        })
    ]
};
