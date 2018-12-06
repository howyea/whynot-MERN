import * as  mongoose from 'mongoose';
export default new mongoose.Schema({
    access_token: String,
    expires_in: String 
})