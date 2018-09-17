/**
 * Created by 毅 on 2016/8/28.
 */

var express = require('express');
var request = require("superagent");
var fs = require('fs');
var path = require('path');
var Base64 = require('js-base64').Base64;
var md5 = require('md5');
var router = express.Router();

var Category = require('../models/Category');
var Content = require('../models/Content');

var data;

const xunfeisdk = require("xunfeisdk");
const { IATAueType, IATEngineType, ISEAueType, ISECategoryType, ISELanguageType, ISEResultLevelType, TTSAueType, TTSAufType, TTSEngineType, TTSVoiceName } = require("xunfeisdk");

/*
* 处理通用的数据
* */
router.use(function (req, res, next) {
    data = {
        userInfo: req.userInfo,
        categories: []
    }

    Category.find().then(function(categories) {
        data.categories = categories;
        next();
    });
});

/*
* 首页
* */
router.get('/api/list', function(req, res, next) {
    console.log('能请求')
    res.header("Content-Type", "application/json");
    data.category = req.query.category || '';
    data.count = 0;
    data.page = Number(req.query.page || 1);
    data.limit = 10;
    data.pages = 0;

    var where = {};
    if (data.category) {
        where.category = data.category
    }

    Content.where(where).count().then(function(count) {
        data.count = count;
        //计算总页数
        data.pages = Math.ceil(data.count / data.limit);
        //取值不能超过pages
        data.page = Math.min( data.page, data.pages );
        //取值不能小于1
        data.page = Math.max( data.page, 1 );

        var skip = (data.page - 1) * data.limit;
        return Content.where(where).find().limit(data.limit).skip(skip).populate(['category', 'user']).sort({
            addTime: -1
        })/* .exec()
        .then((contents) => {
            res.json(contents)
        }); */
        // data.contents = _content;
        // res.render('main/index', data);
        // res.json(data);
    }).then(function(contents) {
        console.log('这也能请求')
        data.contents = contents;
        // res.render('main/index', data);
        res.json(data);
    })
});

router.get('/xunfei', function (req, res, next) {
    const client = new xunfeisdk.Client("5b98829a");
    client.TTSAppKey = "acda6cafe90773158aef65d6e36a8bf7";
    try {
        console.log("还在外面")
        client.TTS("科大讯飞的接口文档写的太烂了", TTSAufType.L16_8K, TTSAueType.LAME, TTSVoiceName.XiaoYan)
        .then(function (result) {
            const mp3 = path.join(__dirname, "要存成的文件.mp3");
            console.log(result)
            fs.writeFileSync(mp3, result.audio, "binary");
        });
    } catch (error) {
        console.log("失败了")
    }
    /* var _curTime=Date.now();
    _curTime = _curTime.toString().substring(0,10);
    console.log(typeof _curTime)
    var _x_param = {
        auf: 'audio/L16;rate=16000',
        aue: 'raw',
        voice_name: 'xiaoyan'
    }
    var _x_param_base64 = Base64.encode( JSON.stringify( _x_param ) );
    console.log(JSON.stringify( _x_param ))
    console.log(_x_param_base64)
    var _checkSum = md5('acda6cafe90773158aef65d6e36a8bf7' + _curTime.toString() + _x_param_base64);
    console.log(_checkSum)
    request.get('http://api.xfyun.cn/v1/service/v1/tts', {
        text: '人生自古谁无死'
    })
    .set('Content-Type','application/x-www-form-urlencoded;charset=UTF-8')
    .set('X-Appid', '5b98829a')
    .set('X-CurTime', _curTime)
    .set('X-Param', _x_param_base64)
    .set('X-CheckSum', _checkSum)
    .then(function (result) {
        var body = result.text;
        console.log(result);
        res.json(body);
    }); */
})

module.exports = router;