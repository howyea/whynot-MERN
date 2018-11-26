const webpack = require('webpack');
const merge = require('webpack-merge');

const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  devtool: 'eval-source-map',

  mode: 'development',

  entry: {
    'app': [
      'webpack-hot-middleware/client?reload=true'
    ]
  },

  output: {
    filename: 'js/[name].js',
    chunkFilename: '[id].chunk.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
//   devServer: {
//     contentBase: '../client/public',
//     historyApiFallback: true,
//     stats: 'minimal', // none (or false), errors-only, minimal, normal (or true) and verbose
    // proxy: {
    //     '/api/*': {
    //         target: 'http://localhost:8088',
    //         changeOrigin: true,
    //         secure: false,
    //     },
    //     '/v1/service/v1/tts': {
    //         target: 'http://api.xfyun.cn',
    //         changeOrigin: true,
    //         secure: false,
    //     }
    // },  
// }
});
