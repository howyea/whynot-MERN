/*
 * @Author: Micheal.Ye 
 * @Date: 2018-08-09 13:44:31 
 * @Last Modified by: Micheal.Ye
 * @Last Modified time: 2018-09-21 09:21:48
 */
import * as  mongoose from 'mongoose';
import categoriesSchema from '../schemas/categories';

export default mongoose.model('Category', categoriesSchema);