"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require("jsonwebtoken");
var fs = require("fs");
var path = require("path");
function generateToken(data) {
    var created = Math.floor(Date.now() / 1000);
    console.log('开始生成token');
    var cert = fs.readFileSync(path.join(__dirname, '../../rsa_private_key.pem'));
    console.log(cert);
    var token = jwt.sign({
        data: data,
        exp: created + 3600 * 24
    }, cert, { algorithm: 'RS256' });
    console.log(token);
    return token;
}
exports.generateToken = generateToken;
