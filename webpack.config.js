var path = require('path');
var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var merge = require('webpack-merge');
var Clean = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var pkg = require('./package.json');

var TARGET = process.env.npm_lifecycle_event;
var ROOT_PATH = path.resolve(__dirname);
var DEMO_APP_PATH = path.resolve(ROOT_PATH, 'demo');
var SRC_PATH = path.resolve(ROOT_PATH, 'src');
var TYPE_PATH = path.resolve(SRC_PATH, 'type/Type.jsx');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');

process.env.BABEL_ENV = TARGET;

var common = {
    entry: DEMO_APP_PATH,
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: BUILD_PATH,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['babel'],
                exclude: /node_modules/
            }
        ]
    }};


var distConfigs  = {
    entry: {
        index: TYPE_PATH
    },
    output: {
        path: BUILD_PATH,
        filename: '[name].js'
    },
    externals:  {
        react: 'react',
        radium: 'radium',
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
                include: SRC_PATH
            }
        ]
    },
    plugins: [
        new Clean(['build']),
        new ExtractTextPlugin('styles.css'),
        new webpack.optimize.CommonsChunkPlugin(
            'vendor',
            '[name].js'
        ),
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

if(TARGET === 'start' || !TARGET) {
    console.log('*** START ***');
    module.exports = merge(common, {
        devtool: 'eval-source-map',
        module: {
            loaders: [
                {
                    test: /\.css$/,
                    loaders: ['style', 'css']
                }
            ]
        },
        devServer: {
            historyApiFallback: true,
            hot: true,
            inline: true,
            progress: true
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new HtmlwebpackPlugin({
            title: 'ReactJS typewriter demo page'
        })
    ]

    });
} 
else if(TARGET === 'build' || TARGET === 'stats') {
    console.log('*** BUILD ***');
    var baseDistConfig = merge(common, distConfigs);
    module.exports = merge(baseDistConfig, {
        output: {
            filename: '[name].js'
        },
        plugins: [ ]
    });
} else if(TARGET === 'build-min' || TARGET === 'stats') {
    console.log('*** BUILD ***');
    var baseDistConfig = merge(common, distConfigs);
    module.exports = merge(baseDistConfig, {
        output: {
            filename: '[name].min.js'
        },
        devtool: 'source-map',
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            })
        ]
    });
}
