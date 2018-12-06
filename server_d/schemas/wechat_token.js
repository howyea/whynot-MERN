"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
exports.default = new mongoose.Schema({
    access_token: String,
    expires_in: String
});
