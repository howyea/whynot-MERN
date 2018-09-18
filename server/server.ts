import * as express from 'express';
import * as fs from 'fs';
const historyApiFallback = require('connect-history-api-fallback');
const mongoose = require('mongoose');
import * as path from 'path';
const webpack = require('webpack');
import * as bodyParser from 'body-parser';
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

// import config from '../config/config';
import * as webpackConfig from '../webpack.config';

const isDev = process.env.NODE_ENV !== 'production';
const port  = process.env.PORT || 8086;

const  User = require('./models/User');
// Configuration
// ================================================================================================

// Set up Mongoose
// mongoose.connect(isDev ? config.db_dev : config.db);
// mongoose.Promise = global.Promise;

const app = express();
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended:false }));

// app.use(express.json());

// API routes
// require('./routes')(app);
app.use('/', require('./routers/main'));

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

  app.use(webpackHotMiddleware(compiler));
  app.use(express.static(path.resolve(__dirname, '../dist')));
} else {
  app.use(express.static(path.resolve(__dirname, '../dist')));
  app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
    res.end();
  });
}
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
