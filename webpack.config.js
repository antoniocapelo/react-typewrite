var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var merge = require('webpack-merge');

var TARGET = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = TARGET;

// webpack configs
var commonConfigs = require('./webpack-common-configs.js');
var distConfigs  = require('./webpack-dist-configs.js');

if(TARGET === 'start' || !TARGET) {
    console.log('*** STARTING DEV SERVER ***');
    module.exports = merge(commonConfigs, {
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
} else if(TARGET === 'build' || TARGET === 'stats') {
    console.log('*** BUILD ***');

    var baseDistConfig = merge(commonConfigs, distConfigs);
    module.exports = merge(baseDistConfig, {
        output: {
            filename: '[name].js'
        },
        plugins: []
    });
} else if(TARGET === 'build-min') {
    console.log('*** BUILD MIN ***');

    var baseDistConfig = merge(commonConfigs, distConfigs);
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
