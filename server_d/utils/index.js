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
function verifyToken(token) {
    var cert = fs.readFileSync(path.join(__dirname, '../../rsa_public_key.pem')), res = { uid: '' };
    try {
        var result = jwt.verify(token, cert, { algorithms: ['RS256'] }) || {};
        var _a = result.exp, exp = _a === void 0 ? 0 : _a, current = Math.floor(Date.now() / 1000);
        if (current <= exp) {
            res = result.data || res;
        }
    }
    catch (e) {
    }
    return res;
}
exports.verifyToken = verifyToken;
