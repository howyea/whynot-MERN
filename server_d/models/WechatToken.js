"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var wechat_token_1 = require("../schemas/wechat_token");
exports.default = mongoose.model('WechatToken', wechat_token_1.default, 'WechatToken');
