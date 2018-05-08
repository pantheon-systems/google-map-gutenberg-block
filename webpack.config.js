const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

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
        './assets/js/index': './src/js/index.js',
    },
    output: {
        path: path.resolve(__dirname),
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
            filename: devMode ? './assets/css/style.css' : './assets/css/style.[chunkhash].css'
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