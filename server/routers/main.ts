/**
 * Created by 毅 on 2016/8/28.
 */

import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
// import * as xunfeisdk from 'xunfeisdk';
// import { IATAueType, IATEngineType, ISEAueType, ISECategoryType, ISELanguageType, ISEResultLevelType, TTSAueType, TTSAufType, TTSEngineType, TTSVoiceName } from "xunfeisdk";
import * as Category from "../models/Category";
import * as Content from "../models/Content";
const router = express.Router();
interface Data{
    category: string,
    count: number,
    page: number,
    limit: number,
    pages: number,
    contents: object[],
    categories: object[]
}
const data:Data = {
    category: '',
    count: 0,
    page: 1,
    limit: 10,
    pages: 0,
    contents: [],
    categories: []
};
router.use(function (req, res, next) {
    // data = {
    //     userInfo: req.userInfo,
    //     categories: []
    // }

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
    data.page = Number(req.query.page || 1);
    interface Where {
        category: string
    }
    const where:Where = {
        category: ''
    };
    if (data.category) {
        where.category = data.category
    }
    console.log(where);
    Content.where({category:"5b6beb1206a5636761a0b6e6"}).count().then(function(count) {
        data.count = count;
        //计算总页数
        data.pages = Math.ceil(data.count / data.limit);
        //取值不能超过pages
        data.page = Math.min( data.page, data.pages );
        //取值不能小于1
        data.page = Math.max( data.page, 1 );

        var skip = (data.page - 1) * data.limit;
        return Content.find().where({category:"5b6beb1206a5636761a0b6e6"}).limit(data.limit).skip(skip).populate(['category', 'user']).sort({
            addTime: -1
        })
    }).then(function(contents) {
        console.log('这也能请求')
        data.contents = contents;
        // res.render('main/index', data);
        res.json(data);
    })
});

// router.get('/xunfei', function (req, res, next) {
//     const client = new xunfeisdk.Client("5b98829a");
//     client.TTSAppKey = "acda6cafe90773158aef65d6e36a8bf7";
//     try {
//         console.log("还在外面")
//         client.TTS("科大讯飞的接口文档写的太烂了", TTSAufType.L16_8K, TTSAueType.LAME, TTSVoiceName.XiaoYan)
//         .then(function (result) {
//             const mp3 = path.join(__dirname, "要存成的文件.mp3");
//             console.log(result)
//             fs.writeFileSync(mp3, result.audio, "binary");
//         });
//     } catch (error) {
//         console.log("失败了")
//     }
// })

module.exports = router;