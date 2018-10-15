/*
 * @Author: Micheal.Ye 
 * @Date: 2018-09-10 15:39:23 
 * @Last Modified by: Micheal.Ye
 * @Last Modified time: 2018-10-15 13:44:58
 */
import request from "superagent";
import { Base64 } from 'js-base64';
import md5 from 'md5';
async function getList () {
    const {body} = await request.get('/api/list', {
        page: 1
    });
    return body;
}

async function login ( params ) {
    const {body} = await request.post('/user/login', params);
    return body;
}

async function word2voice () {
    /* const _date: string = String(new Date());
    const _curTime = String( Date.parse( _date )/1000 );
    console.log(typeof _curTime)
    const _x_param = {
        auf: 'audio/L16;rate=16000',
        aue: 'raw',
        voice_name: 'xiaoyan'
    }
    const _x_param_base64 = Base64.encode( JSON.stringify( _x_param ) );
    console.log(JSON.stringify( _x_param ))
    console.log(_x_param_base64)
    const _checkSum = md5('acda6cafe90773158aef65d6e36a8bf7' + _curTime + _x_param);
    console.log(_checkSum) */
    await request.get('/xunfei', {})
    .set('Content-Type','application/x-www-form-urlencoded;charset=UTF-8')
   /*  .set('X-Appid', '5b98829a')
    .set('X-CurTime', _curTime)
    .set('X-Param', _x_param_base64)
    .set('X-CheckSum', _checkSum);
    return body; */
}

export {
    getList,
    login,
    word2voice
}