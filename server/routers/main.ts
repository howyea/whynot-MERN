/**
 * Created by 毅 on 2016/8/28.
 */

import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as superagent from 'superagent';
// import * as xunfeisdk from 'xunfeisdk';
// import { IATAueType, IATEngineType, ISEAueType, ISECategoryType, ISELanguageType, ISEResultLevelType, TTSAueType, TTSAufType, TTSEngineType, TTSVoiceName } from "xunfeisdk";
import Category from "../models/Category";
import Content from "../models/Content";
import User from '../models/User';
import WechatToken from '../models/WechatToken';
import { generateToken, verifyToken } from '../utils';
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
        this.weChat();
        this.blogRouters();
    }
    private useModals () : void {
        const _this = this;
        Category.find().then((categories) => {
            _this.data.categories = categories;
        });
        User.find().then((users) => {
        });
    }
    private weChat () : void {
        this.router.get('/handshake', (req, res, next) => {
            const { echostr } = req.query;
            res.send( echostr );
        });
        this.router.get('/weChatToken', (req, res, next) => {
            async function saveWeChatTokenApi () {
                const { body } = await superagent.get('https://api.weixin.qq.com/cgi-bin/token', {
                    grant_type: 'client_credential',
                    appid: 'wx4a52d2d162fcf80d',
                    secret: 'b0b03bfe2d13306217ca36f29d47ec25'
                });
                console.log("这个是token"+JSON.stringify(body))
                return body;
            }
            WechatToken.find().then( async function (Arr) {
                if ( Arr.length ) {
                    console.log("这个是数据库中的token"+Arr);
                    if ( Arr[0].expires_in < new Date().getTime()) {
                        const result = await saveWeChatTokenApi();
                        const access_token = result.access_token;
                        const expires_in = new Date().getTime() + result.expires_in*1000;
                        WechatToken.update({_id: Arr[0]._id}, {
                            access_token,
                            expires_in
                        }, {multi: true}, function(err, docs){
                            if(err) console.log(err);
                            console.log('更改成功：' + JSON.stringify( docs ));
                            return result
                        })
                    }
                    return Arr;
                } else {
                    const result = await saveWeChatTokenApi();
                    const access_token = result.access_token;
                    const expires_in = new Date().getTime() + result.expires_in*1000
                    var wechatToken = new WechatToken({
                        access_token,
                        expires_in
                    });
                    return wechatToken.save();
                }
            }).then(function(newToken) {
                res.json({newToken});
            });
        })
        this.router.post('/wechatTicket', async (req, res, next) => {
            console.log('进来了吗')
            const _token = await superagent.get('http://wonder.codemojos.com/weChatToken');
            console.log('这个是获取过来的token    '+_token);
            // superagent.post('https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=TOKEN')
        })
    }
    private blogRouters () : void {
        this.router.get('/api/list', (req, res, next) => {
            const { token }= req.headers;
            if ( token ) {
                interface Result{
                    uid: string
                }
                const result: Result = verifyToken( token );
                const { uid } = result;
                if ( uid ) {
                    console.log("这是用户id"+uid);
                }
            }
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
                this.data.contents = contents;
                // res.render('main/index', data);
                res.json(this.data);
            })
        });
        /*
        * 登录
        * */
        this.router.post('/user/login', function(req, res) {
            const username = req.body.username;
            const password = req.body.password;

            const responseData = {
                code: 0,
                message: '',
                userInfo: {
                    username:'',
                    token: ''
                }
            }
            if ( username == '' || password == '' ) {
                responseData.code = 1;
                responseData.message = '用户名和密码不能为空';
                res.json(responseData);
                return;
            }

            //查询数据库中相同用户名和密码的记录是否存在，如果存在则登录成功
            User.findOne({
                username: username,
                password: password
            }).then(function(userInfo) {
                if (!userInfo) {
                    responseData.code = 2;
                    responseData.message = '用户名或密码错误';
                    res.json(responseData);
                    return;
                }
                //用户名和密码是正确的
                const token = generateToken({uid: userInfo._id});
                responseData.message = '登录成功';
                responseData.userInfo = {
                    username: userInfo.username,
                    token
                }
                res.json(responseData);
                return;
            })

        });
    }
}
export default new Routers().router;