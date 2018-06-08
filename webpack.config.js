const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');

const devMode = (process.argv.slice().pop() !== 'production');

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
    ],
};

module.exports = {
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    entry: {
        'js/index': './src/js/index.js',
    },
    output: {
        path: path.resolve(__dirname) + '/assets/',
        filename: devMode ? '[name].js' : '[name].[chunkhash].js',
    },
    watch: devMode,
    optimization: {
        minimizer: [
          new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: devMode
          }),
          new OptimizeCSSAssetsPlugin({})
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: devMode ? 'css/style.css' : 'css/style.[chunkhash].css'
        }),
        new WebpackCleanupPlugin({
            exclude: ['images/**/*'],
        })
    ],
    module: {
        rules: [{
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {  
                        cacheDirectory: true  
                    }
                },
            },
            {
                test: /style\.s?css$/,
                use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
            },
        ],
    }
};