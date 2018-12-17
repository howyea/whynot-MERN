"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
exports.default = new mongoose.Schema({
    access_token: String,
    token_expires_in: String,
    ticket: String,
    ticket_expires_in: String
});
