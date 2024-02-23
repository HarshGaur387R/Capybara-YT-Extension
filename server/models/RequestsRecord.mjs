import mongoose, { Schema } from "mongoose";

const RequestsRecord = new Schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Sender id is required'],
    },
    format: {
        type: String,
        enum: ['audio', 'video']
    },
    status: {
        type: String,
        enum: ['Failed', 'Pending', 'Succeed'],
        default: 'Pending'
    },
    url: String,
    timestamp: Date,
    sender_token: String,
    sender_ip_address: String,
    sender_user_agent: String
})

export default mongoose.model('RequestsRecord', RequestsRecord);