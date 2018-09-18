var webpack = require('webpack');
var merge = require('webpack-merge');
var helpers = require('./helpers');
var commonConfig = require('./webpack.common');
module.exports = merge(commonConfig, {
    mode: 'production',
    output: {
        filename: 'js/[name].[hash].js',
        chunkFilename: '[id].[hash].chunk.js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false,
                screw_ie8: true
            },
            output: {
                comments: false
            }
        })
    ]
});
