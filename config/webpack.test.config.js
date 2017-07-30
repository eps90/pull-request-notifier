const path = require('path');

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
    }
};
