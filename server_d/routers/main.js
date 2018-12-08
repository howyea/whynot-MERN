"use strict";
/**
 * Created by 毅 on 2016/8/28.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var superagent = require("superagent");
// import * as xunfeisdk from 'xunfeisdk';
// import { IATAueType, IATEngineType, ISEAueType, ISECategoryType, ISELanguageType, ISEResultLevelType, TTSAueType, TTSAufType, TTSEngineType, TTSVoiceName } from "xunfeisdk";
var Category_1 = require("../models/Category");
var Content_1 = require("../models/Content");
var User_1 = require("../models/User");
var WechatToken_1 = require("../models/WechatToken");
var utils_1 = require("../utils");
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
        this.weChat();
        this.blogRouters();
    }
    Routers.prototype.useModals = function () {
        var _this = this;
        Category_1.default.find().then(function (categories) {
            _this.data.categories = categories;
        });
        User_1.default.find().then(function (users) {
        });
    };
    Routers.prototype.weChat = function () {
        this.router.get('/handshake', function (req, res, next) {
            var echostr = req.query.echostr;
            res.send(echostr);
        });
        this.router.get('/weChatToken', function (req, res, next) {
            function saveWeChatTokenApi() {
                return __awaiter(this, void 0, void 0, function () {
                    var body;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, superagent.get('https://api.weixin.qq.com/cgi-bin/token', {
                                    grant_type: 'client_credential',
                                    appid: 'wx4a52d2d162fcf80d',
                                    secret: 'b0b03bfe2d13306217ca36f29d47ec25'
                                })];
                            case 1:
                                body = (_a.sent()).body;
                                console.log("这个是token" + JSON.stringify(body));
                                return [2 /*return*/, body];
                        }
                    });
                });
            }
            WechatToken_1.default.find().then(function (Arr) {
                return __awaiter(this, void 0, void 0, function () {
                    var result_1, access_token, expires_in, result, access_token, expires_in, wechatToken;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!Arr.length) return [3 /*break*/, 3];
                                console.log("这个是数据库中的token" + Arr);
                                if (!(Arr[0].expires_in < new Date().getTime())) return [3 /*break*/, 2];
                                return [4 /*yield*/, saveWeChatTokenApi()];
                            case 1:
                                result_1 = _a.sent();
                                access_token = result_1.access_token;
                                expires_in = new Date().getTime() + result_1.expires_in * 1000;
                                WechatToken_1.default.update({ _id: Arr[0]._id }, {
                                    access_token: access_token,
                                    expires_in: expires_in
                                }, { multi: true }, function (err, docs) {
                                    if (err)
                                        console.log(err);
                                    console.log('更改成功：' + docs);
                                    return result_1;
                                });
                                _a.label = 2;
                            case 2: return [2 /*return*/, Arr];
                            case 3: return [4 /*yield*/, saveWeChatTokenApi()];
                            case 4:
                                result = _a.sent();
                                access_token = result.access_token;
                                expires_in = new Date().getTime() + result.expires_in * 1000;
                                wechatToken = new WechatToken_1.default({
                                    access_token: access_token,
                                    expires_in: expires_in
                                });
                                return [2 /*return*/, wechatToken.save()];
                        }
                    });
                });
            }).then(function (newToken) {
                res.json({ newToken: newToken });
            });
        });
    };
    Routers.prototype.blogRouters = function () {
        var _this_1 = this;
        this.router.get('/api/list', function (req, res, next) {
            var token = req.headers.token;
            if (token) {
                var result = utils_1.verifyToken(token);
                var uid = result.uid;
                if (uid) {
                    console.log("这是用户id" + uid);
                }
            }
            _this_1.data.category = req.query.category || '';
            _this_1.data.page = Number(req.query.page || 1);
            var where = {
                category: ''
            };
            if (_this_1.data.category) {
                where.category = _this_1.data.category;
            }
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
                _this_1.data.contents = contents;
                // res.render('main/index', data);
                res.json(_this_1.data);
            });
        });
        /*
        * 登录
        * */
        this.router.post('/user/login', function (req, res) {
            var username = req.body.username;
            var password = req.body.password;
            var responseData = {
                code: 0,
                message: '',
                userInfo: {
                    username: '',
                    token: ''
                }
            };
            if (username == '' || password == '') {
                responseData.code = 1;
                responseData.message = '用户名和密码不能为空';
                res.json(responseData);
                return;
            }
            //查询数据库中相同用户名和密码的记录是否存在，如果存在则登录成功
            User_1.default.findOne({
                username: username,
                password: password
            }).then(function (userInfo) {
                if (!userInfo) {
                    responseData.code = 2;
                    responseData.message = '用户名或密码错误';
                    res.json(responseData);
                    return;
                }
                //用户名和密码是正确的
                var token = utils_1.generateToken({ uid: userInfo._id });
                responseData.message = '登录成功';
                responseData.userInfo = {
                    username: userInfo.username,
                    token: token
                };
                res.json(responseData);
                return;
            });
        });
    };
    return Routers;
}());
exports.default = new Routers().router;
