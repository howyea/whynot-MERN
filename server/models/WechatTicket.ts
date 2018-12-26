import * as mongoose from 'mongoose';
import wechatTicket from '../schemas/wechat_ticket';
export default mongoose.model('WechatTicket', wechatTicket, 'WechatTicket');