var paths = require('./path-configs');

var commonConfigs = {
    entry: paths.DEMO_APP_PATH,
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: paths.BUILD_PATH,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['babel'],
                exclude: /node_modules/
            }
        ],
        preLoaders: [
            {
                test: /\.jsx?$/,
                loaders: ['eslint'],
                exclude: /node_modules/
            }
        ]
    }
};

module.exports = commonConfigs;
