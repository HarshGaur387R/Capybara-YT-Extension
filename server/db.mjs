import mongoose from "mongoose";
import configs from "./config/config.mjs";

export async function connectToDatabase() {
    mongoose.connect(`${configs.MONGODB_CONNECTION_STRING}/${configs.DATABASE_NAME}?retryWrites=true&writeConcern=majority`)
    .then(() => {
        console.log('Connected to mongodb database');
    }).catch((error) => {
        console.error('Failed to connect to the database, error: ', error);
    })
}