import mongoose, { Schema } from "mongoose";

const NewsLatterSubsSchema = new Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('NewsLatterSub', NewsLatterSubsSchema);