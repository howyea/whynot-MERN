"use strict";
/*
 * @Author: Micheal.Ye
 * @Date: 2018-08-09 13:43:20
 * @Last Modified by: Micheal.Ye
 * @Last Modified time: 2018-09-21 09:24:02
 */
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
exports.default = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
});
