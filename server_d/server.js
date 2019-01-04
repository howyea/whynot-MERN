"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var historyApiFallback = require("connect-history-api-fallback");
var mongoose = require("mongoose");
var path = require("path");
var webpack = require("webpack");
var bodyParser = require("body-parser");
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpackHotMiddleware = require("webpack-hot-middleware");
// import config from '../config/config';
var webpackConfig = require("../webpack.config");
var webpackPc = require("../config/webpack.pc");
var main_1 = require("./routers/main");
var isDev = process.env.NODE_ENV !== 'production';
var port = process.env.PORT || 8086;
// Configuration
// ================================================================================================
// Set up Mongoose
// mongoose.connect(isDev ? config.db_dev : config.db);
// mongoose.Promise = global.Promise;
var app = express();
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.json());
// API routes
// require('./routes')(app);
app.use('/', main_1.default);
if (isDev) {
    app.use(historyApiFallback({
        verbose: false
    }));
    console.log(process.env.NODE_ENV);
    var _node_env = process.env.NODE_ENV;
    if (_node_env.indexOf('mobile') !== -1) {
        console.log("mobile" + process.env.NODE_ENV);
        var compiler = webpack(webpackConfig);
        app.use(webpackDevMiddleware(compiler, {
            publicPath: webpackConfig.output.publicPath,
            contentBase: path.resolve(__dirname, '../../client/public'),
            stats: {
                colors: true,
                hash: false,
                timings: true,
                chunks: false,
                chunkModules: false,
                modules: false
            }
        }));
        app.use(webpackHotMiddleware(compiler));
        app.use(express.static(path.resolve(__dirname, '../dist')));
    }
    else if (_node_env.indexOf('pc') !== -1) {
        console.log("pc" + process.env.NODE_ENV);
        var compiler = webpack(webpackPc);
        app.use(webpackDevMiddleware(compiler, {
            index: 'pc.html',
            publicPath: webpackPc.output.publicPath,
            contentBase: path.join(__dirname, '../../dist_pc'),
            // contentBase: path.resolve(__dirname, '../../client-pc'),
            stats: {
                colors: true,
                hash: false,
                timings: true,
                chunks: false,
                chunkModules: false,
                modules: false
            }
        }));
        app.use(webpackHotMiddleware(compiler));
        app.use(express.static(path.resolve(__dirname, '../dist_pc')));
    }
    console.log("来这里");
}
else {
    console.log("来这里22222");
    //   app.use(express.static('dist'));
    app.use(express.static(path.resolve(__dirname, '../dist')));
    app.use(express.static(path.resolve(__dirname, '../dist_pc')));
    // app.use(express.static('dist_pc'));
    //   app.use(express.static(path.resolve(__dirname, '../dist')));
    app.use('*', function (req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
        // res.sendFile(path.resolve(__dirname, '../dist/index.html'));
        res.sendFile(path.resolve(__dirname, '../dist_pc/index.html?xvzzxvdgsdg'));
        res.end();
    });
}
/* app.use(express.static('dist'));
app.get('*', function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
    res.end();
}); */
mongoose.connect('mongodb://120.79.165.210:27017/blog', { useNewUrlParser: true }, function (err) {
    if (err) {
        console.log('数据库连接失败');
    }
    else {
        console.log('数据库连接成功');
        app.listen(8089);
    }
});
// app.listen(port, '0.0.0.0', (err) => {
//   if (err) {
//     console.log(err);
//   }
//   console.info('>>> 🌎 Open http://0.0.0.0:%s/ in your browser.', port);
// });
module.exports = app;
