/**
 * Created by 毅 on 2016/8/28.
 */

import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
// import * as xunfeisdk from 'xunfeisdk';
// import { IATAueType, IATEngineType, ISEAueType, ISECategoryType, ISELanguageType, ISEResultLevelType, TTSAueType, TTSAufType, TTSEngineType, TTSVoiceName } from "xunfeisdk";
import Category from "../models/Category";
import Content from "../models/Content";
import User from '../models/User';
interface Data{
    category: string,
    count: number,
    page: number,
    limit: number,
    pages: number,
    contents: object[],
    categories: object[]
}
// const data:Data = {
//     category: '',
//     count: 0,
//     page: 1,
//     limit: 10,
//     pages: 0,
//     contents: [],
//     categories: []
// };

class Routers {
    public router;
    public data:Data;
    constructor () {
        this.router = express.Router();
        this.data = {
            category: '',
            count: 0,
            page: 1,
            limit: 10,
            pages: 0,
            contents: [],
            categories: []
        };
        this.useModals();
        this.blogRouters();
    }
    private useModals () : void {
        const _this = this;
        Category.find().then((categories) => {
            console.log(categories);
            _this.data.categories = categories;
        });
        User.find().then((users) => {
            console.log(users);
        });
    }
    private blogRouters () : void {
        this.router.get('/api/list', (req, res, next) => {
            console.log('能请求')
            res.header("Content-Type", "application/json");
            this.data.category = req.query.category || '';
            this.data.page = Number(req.query.page || 1);
            interface Where {
                category: string
            }
            const where:Where = {
                category: ''
            };
            if (this.data.category) {
                where.category = this.data.category
            }
            console.log(where);
            Content.where({category:"5b6beb1206a5636761a0b6e6"}).countDocuments().then((count) => {
                this.data.count = count;
                //计算总页数
                this.data.pages = Math.ceil(this.data.count / this.data.limit);
                //取值不能超过pages
                this.data.page = Math.min( this.data.page, this.data.pages );
                //取值不能小于1
                this.data.page = Math.max( this.data.page, 1 );
        
                var skip = (this.data.page - 1) * this.data.limit;
                return Content.find().where({category:"5b6beb1206a5636761a0b6e6"}).limit(this.data.limit).skip(skip).populate(['category', 'user']).sort({
                    addTime: -1
                })
            }).then((contents) => {
                console.log('这也能请求')
                this.data.contents = contents;
                // res.render('main/index', data);
                res.json(this.data);
            })
        });
    }
}
export default new Routers().router;