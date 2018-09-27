"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: Micheal.Ye
 * @Date: 2018-08-09 13:43:08
 * @Last Modified by: Micheal.Ye
 * @Last Modified time: 2018-08-09 13:44:00
 */
var mongoose = require("mongoose");
//分类的表结构
exports.default = new mongoose.Schema({
    name: String
});
