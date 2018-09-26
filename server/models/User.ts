import * as mongoose from 'mongoose';
import usersSchema from '../schemas/users';

export default mongoose.model('User', usersSchema);