import * as  mongoose from 'mongoose';
export default new mongoose.Schema({
    ticket: String,
    ticket_expires_in: String
})