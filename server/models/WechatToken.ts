import * as mongoose from 'mongoose';
import wechatToken from '../schemas/wechat_token';
export default mongoose.model('WechatToken', wechatToken, 'WechatToken');