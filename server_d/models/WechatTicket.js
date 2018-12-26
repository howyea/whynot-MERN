"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var wechat_ticket_1 = require("../schemas/wechat_ticket");
exports.default = mongoose.model('WechatTicket', wechat_ticket_1.default, 'WechatTicket');
