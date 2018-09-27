"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var users_1 = require("../schemas/users");
exports.default = mongoose.model('User', users_1.default);
