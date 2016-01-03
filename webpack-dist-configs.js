var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var Clean = require('clean-webpack-plugin');
var paths = require('./path-configs');

var distConfigs  = {
    entry: {
        index: paths.TYPE_PATH
    },
    output: {
        path: paths.BUILD_PATH,
        libraryTarget: 'umd',
        filename: '[name].js'
    },
    externals:  {
        react: 'react',
        /* more complicated mapping for lodash */
        /* we need to access it differently depending */
        /* on the environment */
        lodash: {
            commonjs: 'lodash',
            commonjs2: 'lodash',
            amd: '_',
            root: '_'
        }
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css'),
                include: paths.SRC_PATH
            }
        ]
    },
    plugins: [
        new Clean(['build']),
        new ExtractTextPlugin('react-typewrite.css'),
        new webpack.DefinePlugin({
            'process.env': {
                // This affects react lib size
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};

module.exports = distConfigs;
