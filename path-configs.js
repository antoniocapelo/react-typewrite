var path = require('path');

// Paths
var ROOT_PATH = path.resolve(__dirname);
var DEMO_APP_PATH = path.resolve(ROOT_PATH, 'demo');
var SRC_PATH = path.resolve(ROOT_PATH, 'src');
var TYPE_PATH = path.resolve(SRC_PATH, 'type/Type.jsx');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');

module.exports = {
    ROOT_PATH: ROOT_PATH,
    DEMO_APP_PATH: DEMO_APP_PATH,
    SRC_PATH: SRC_PATH, 
    TYPE_PATH: TYPE_PATH, 
    BUILD_PATH: BUILD_PATH
};
