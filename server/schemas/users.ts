/*
 * @Author: Micheal.Ye 
 * @Date: 2018-08-09 13:43:20 
 * @Last Modified by: Micheal.Ye
 * @Last Modified time: 2018-09-21 09:24:02
 */

import * as  mongoose from 'mongoose';
export default new mongoose.Schema({
    username: String,
    password: String ,
    isAdmin: {
        type: Boolean,
        default: false
    }
})