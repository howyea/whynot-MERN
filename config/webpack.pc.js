var path = require('path')
var webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const helpers = require('./helpers');

module.exports = {
    entry: ['webpack-hot-middleware/client?reload=true', './client_pc/index.ts'],
    output: {
        path: path.resolve(__dirname, '../server_file/dist_pc'),
        publicPath: '/',
        filename: 'js/build.js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {

                        'scss': 'vue-style-loader!css-loader!sass-loader',
                        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
                    }
                    // other vue-loader options go here
                }
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: [
                    /node_modules/,
                    /client/
                ],
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                    configFile: 'tsconfig.pc.json'
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            filename: 'pc.html',
            template: './client_pc/index.html',
            inject: true,
            hash: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
        }),
        new CopyWebpackPlugin([{
            from: helpers.root('client_pc'),
            ignore: [ 'index.html' ]
        }])
    ],
    /* devServer: {
        index: 'index.html',
        host: '0.0.0.0',
        contentBase: path.join(__dirname, '../dist_pc'),
        compress: true,
        port: 8082,
        watchContentBase: true,
        watchOptions: {
            poll: true
        },
        historyApiFallback: true,
    }, */
    performance: {
        hints: false
    },
    devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
}