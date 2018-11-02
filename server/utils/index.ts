import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';

export function generateToken(data: object){
    let created = Math.floor(Date.now() / 1000);
    console.log('开始生成token');
    let cert = fs.readFileSync(path.join(__dirname, '../../rsa_private_key.pem'));
    console.log(cert);
    let token = jwt.sign({
        data,
        exp: created + 3600 * 24
    }, cert, {algorithm: 'RS256'});
    console.log(token);
    return token;
}

export function verifyToken(token: string){
    interface Result{
        uid: string
    }
    let cert = fs.readFileSync(path.join(__dirname, '../../rsa_public_key.pem')),res: Result = {uid: ''};
    try{
        let result = jwt.verify(token, cert, {algorithms: ['RS256']}) || {};
        let {exp = 0} = result,current = Math.floor(Date.now()/1000);
        if(current <= exp){
            res = result.data || res;
        }
    }catch(e){
    
    }
    return res;
    
}