import * as express from 'express';
import * as fs from 'fs';
import * as historyApiFallback from 'connect-history-api-fallback';
import * as mongoose from 'mongoose';
import * as path from 'path';
import * as webpack from 'webpack';
import * as bodyParser from 'body-parser';
import * as webpackDevMiddleware from 'webpack-dev-middleware';
import * as webpackHotMiddleware from 'webpack-hot-middleware';

// import config from '../config/config';
import * as webpackConfig from '../webpack.config';
import main from './routers/main'

const isDev = process.env.NODE_ENV !== 'production';
const port  = process.env.PORT || 8086;

// Configuration
// ================================================================================================

// Set up Mongoose
// mongoose.connect(isDev ? config.db_dev : config.db);
// mongoose.Promise = global.Promise;

const app = express();
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());
// app.use(express.json());

// API routes
// require('./routes')(app);
app.use('/', main);

if (isDev) {
  const compiler = webpack(webpackConfig);
  
  app.use(historyApiFallback({
      verbose: false
    }));
    
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
  console.log("来这里");
  app.use(webpackHotMiddleware(compiler));
  app.use(express.static(path.resolve(__dirname, '../dist')));
} else {
  console.log("来这里22222");

  app.use(express.static('dist'));
//   app.use(express.static(path.resolve(__dirname, '../dist')));
  app.get('*', function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
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
mongoose.connect('mongodb://120.79.165.210:27017/blog',  { useNewUrlParser: true }, function ( err) {
    if ( err ) {
        console.log('数据库连接失败')
    } else {
        console.log('数据库连接成功')
        app.listen(8088);
    }
});
// app.listen(port, '0.0.0.0', (err) => {
//   if (err) {
//     console.log(err);
//   }

//   console.info('>>> 🌎 Open http://0.0.0.0:%s/ in your browser.', port);
// });

module.exports = app;
