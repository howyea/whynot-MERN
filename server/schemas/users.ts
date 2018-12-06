import * as  mongoose from 'mongoose';
export default new mongoose.Schema({
    username: String,
    password: String ,
    isAdmin: {
        type: Boolean,
        default: false
    }
})