const path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: 'inline-source-map',

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
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
