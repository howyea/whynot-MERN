"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: Micheal.Ye
 * @Date: 2018-08-09 15:52:31
 * @Last Modified by: Micheal.Ye
 * @Last Modified time: 2018-09-21 09:18:15
 */
var mongoose = require("mongoose");
var contents_1 = require("../schemas/contents");
exports.default = mongoose.model('Content', contents_1.default);
