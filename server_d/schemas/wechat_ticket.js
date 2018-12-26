"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
exports.default = new mongoose.Schema({
    ticket: String,
    ticket_expires_in: String
});
