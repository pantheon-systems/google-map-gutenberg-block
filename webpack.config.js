const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// Set different CSS extraction for editor only and common block styles
const blocksCSSPlugin = new ExtractTextPlugin({
    filename: './assets/css/style.min.css',
});

// Configuration for the ExtractTextPlugin.
const extractConfig = {
    use: [{
            loader: 'raw-loader'
        },
        {
            loader: 'postcss-loader',
            options: {
                plugins: [require('autoprefixer')],
            },
        },
        {
            loader: 'sass-loader',
            query: {
                outputStyle: 'production' === process.env.NODE_ENV ? 'compressed' : 'nested',
            },
        },
    ],
};

module.exports = {
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    entry: {
        './assets/js/index': './src/js/index.js',
    },
    output: {
        path: path.resolve(__dirname),
        filename: '[name].min.js',
    },
    watch: true,
    devtool: 'cheap-eval-source-map',
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /style\.s?css$/,
                use: blocksCSSPlugin.extract(extractConfig),
            },
        ],
    },
    plugins: [
        blocksCSSPlugin
    ],
};