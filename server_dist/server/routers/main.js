"use strict";
/**
 * Created by 毅 on 2016/8/28.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
// import * as xunfeisdk from 'xunfeisdk';
// import { IATAueType, IATEngineType, ISEAueType, ISECategoryType, ISELanguageType, ISEResultLevelType, TTSAueType, TTSAufType, TTSEngineType, TTSVoiceName } from "xunfeisdk";
var Category_1 = require("../models/Category");
var Content_1 = require("../models/Content");
var User_1 = require("../models/User");
// const data:Data = {
//     category: '',
//     count: 0,
//     page: 1,
//     limit: 10,
//     pages: 0,
//     contents: [],
//     categories: []
// };
var Routers = /** @class */ (function () {
    function Routers() {
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
    Routers.prototype.useModals = function () {
        var _this = this;
        Category_1.default.find().then(function (categories) {
            console.log(categories);
            _this.data.categories = categories;
        });
        User_1.default.find().then(function (users) {
            console.log(users);
        });
    };
    Routers.prototype.blogRouters = function () {
        var _this_1 = this;
        this.router.get('/api/list', function (req, res, next) {
            console.log('能请求');
            res.header("Content-Type", "application/json");
            _this_1.data.category = req.query.category || '';
            _this_1.data.page = Number(req.query.page || 1);
            var where = {
                category: ''
            };
            if (_this_1.data.category) {
                where.category = _this_1.data.category;
            }
            console.log(where);
            Content_1.default.where({ category: "5b6beb1206a5636761a0b6e6" }).countDocuments().then(function (count) {
                _this_1.data.count = count;
                //计算总页数
                _this_1.data.pages = Math.ceil(_this_1.data.count / _this_1.data.limit);
                //取值不能超过pages
                _this_1.data.page = Math.min(_this_1.data.page, _this_1.data.pages);
                //取值不能小于1
                _this_1.data.page = Math.max(_this_1.data.page, 1);
                var skip = (_this_1.data.page - 1) * _this_1.data.limit;
                return Content_1.default.find().where({ category: "5b6beb1206a5636761a0b6e6" }).limit(_this_1.data.limit).skip(skip).populate(['category', 'user']).sort({
                    addTime: -1
                });
            }).then(function (contents) {
                console.log('这也能请求');
                _this_1.data.contents = contents;
                // res.render('main/index', data);
                res.json(_this_1.data);
            });
        });
    };
    return Routers;
}());
exports.default = new Routers().router;
