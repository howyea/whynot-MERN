"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: Micheal.Ye
 * @Date: 2018-08-09 13:44:31
 * @Last Modified by: Micheal.Ye
 * @Last Modified time: 2018-09-21 09:21:48
 */
var mongoose = require("mongoose");
var categories_1 = require("../schemas/categories");
exports.default = mongoose.model('Category', categories_1.default);
