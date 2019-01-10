const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const path =require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// var TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;

const helpers = require('./helpers');

const NODE_ENV = process.env.NODE_ENV;
const isProd = NODE_ENV === 'production';

module.exports = {
    entry: {
        'app': [
            helpers.root('client/app/index.tsx')
        ]
    },

    output: {
        path: helpers.root('server_file/dist'),
        publicPath: '/'
    },
    devtool: "source-map",
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json', '.css', '.less', '.scss', '.html'],
        alias: {
            'app': 'client/app'
        }
    },
    module: {
        rules: [
            // JS files
            { 
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
                options: {
                    configFileName: 'tsconfig.mobile.json'
                }
            },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            {
                test: /\.jsx?$/,
                include: helpers.root('client'),
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'es2016', 'es2017', 'stage-0']
                }
            },
            {
                test: /\.css$/,
                include: [
                    /node_modules/
                ],
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader?minimize',
                        'postcss-loader',
                    ],
                }),
            },
            // {
            //     test: /\.css$/,
            //     include: /node_modules/,
            //     loader: 'style-loader!css-loader'
            // },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loader: 'style-loader!css-loader!postcss-loader?modules'
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    {loader: 'less-loader'},
                ],
                include: /node_modules/,
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                loader: 'style-loader!css-loader!postcss-loader?modules'
            },
            
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                include: /client/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'img/[name]_[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                include: /client/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    },
    /* externals: {
        'react':'react',
        'react-dom':"react-dom",
        'react-router':'react-dom',
        'moment':'moment',
        "antd-mobile":"antd-mobile"
    }, */
    plugins: [
        // new TsConfigPathsPlugin({ configFileName: 'mobile.tsconfig.json' }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(NODE_ENV)
            }
        }),

        new HtmlWebpackPlugin({
            filename: 'mobile.html',
            template: helpers.root('client/public/index.html'),
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

        new ExtractTextPlugin({
            filename: 'css/[name].css',
            disable: !isProd
        }),

        new CopyWebpackPlugin([{
            from: helpers.root('client/public'),
            ignore: [ 'index.html' ]
        }])
    ]
};
