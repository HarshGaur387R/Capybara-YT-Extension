import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    name:{
        type:String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    isEmailVerified:{
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('user', UserSchema);