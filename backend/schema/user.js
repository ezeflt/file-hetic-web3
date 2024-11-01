import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    email: String,
    password: String,
    token: String,
});

const User = mongoose.model('users', userSchema);

export default User;