var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var helpers = require('./helpers');
var NODE_ENV = process.env.NODE_ENV;
var isProd = NODE_ENV === 'production';
module.exports = {
    entry: {
        'app': [
            helpers.root('client/app/index.tsx')
        ]
    },
    output: {
        path: helpers.root('dist'),
        publicPath: '/'
    },
    devtool: "source-map",
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json', '.css', '.scss', '.html'],
        alias: {
            'app': 'client/app'
        }
    },
    module: {
        rules: [
            // JS files
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            {
                test: /\.jsx?$/,
                include: helpers.root('client'),
                loader: 'babel-loader'
            },
            // SCSS files
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                'sourceMap': true,
                                'importLoaders': 1
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: function () { return [
                                    autoprefixer
                                ]; }
                            }
                        },
                        'sass-loader'
                    ]
                })
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
    //   externals: {
    //     "react": "React",
    //     "react-dom": "ReactDOM"
    // },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(NODE_ENV)
            }
        }),
        new HtmlWebpackPlugin({
            template: helpers.root('client/public/index.html'),
            inject: 'body'
        }),
        new ExtractTextPlugin({
            filename: 'css/[name].[hash].css',
            disable: !isProd
        }),
        new CopyWebpackPlugin([{
                from: helpers.root('client/public')
            }])
    ]
};
