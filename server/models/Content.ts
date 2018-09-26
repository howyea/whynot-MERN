/*
 * @Author: Micheal.Ye 
 * @Date: 2018-08-09 15:52:31 
 * @Last Modified by: Micheal.Ye
 * @Last Modified time: 2018-09-21 09:18:15
 */
import * as mongoose from 'mongoose';
import contentsSchema from '../schemas/contents';
export default mongoose.model('Content', contentsSchema);