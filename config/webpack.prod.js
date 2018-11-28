const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const helpers = require('./helpers');
const commonConfig = require('./webpack.common');
const WebpackBundleSizeAnalyzerPlugin = require('webpack-bundle-size-analyzer').WebpackBundleSizeAnalyzerPlugin;

module.exports = merge(commonConfig, {
  mode: 'production',

  output: {
    filename: 'js/[name].js',
    chunkFilename: '[id].[hash].chunk.js'
  },
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          output: {
            comments: false
          },
          compress: {
            warnings: false
          }
        }
      }),
    ]
  },
  plugins: [
    new WebpackBundleSizeAnalyzerPlugin('./plain-report.txt')
  ]
});
