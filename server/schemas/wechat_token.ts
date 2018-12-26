import * as  mongoose from 'mongoose';
export default new mongoose.Schema({
    access_token: String,
    token_expires_in: String
})