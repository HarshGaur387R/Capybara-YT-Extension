import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date,
    },
    accessKey: {
        type: String,
        unique: true
    },
    total_number_of_succeed_requests: {
        type: Number,
        default: 0
    },
    requestsRecord: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'RequestsRecord'
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);