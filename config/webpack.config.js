const path = require('path');

module.exports = {
    entry: {
        main: './src/main'
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
                exclude: /node_modules/
            }
        ]
    },

    resolve: {
        extensions: ['.ts', '.js']
    }
};
