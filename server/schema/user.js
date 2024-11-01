import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    email: String,
    password: String,
    token: String,
    totalUploadSize: { type: Number, default: 0 }
});

const User = mongoose.model('users', userSchema);

export default User;