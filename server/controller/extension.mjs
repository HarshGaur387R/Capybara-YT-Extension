import ytdl from "ytdl-core";
import https_codes from "../config/http_code.mjs";
import User from "../models/User.mjs";
import RequestsRecord from '../models/RequestsRecord.mjs'

const MAX_VIDEO_LENGTH = 6; // In minutes.

export async function getVideo(req, res, next) {
    let record; // Declare record variable outside the try-catch block to access it in the catch block
    try {
        if (!req.query) throw Object.assign(new Error("Query not provided"), { statusCode: https_codes.BAD_REQUEST });
        if (!req.query.url) throw Object.assign(new Error("Url is not provided"), { statusCode: https_codes.BAD_REQUEST });
        if (!req.query.url.includes('youtube.com')) throw Object.assign(new Error("Provide url only for youtube"), { statusCode: https_codes.BAD_REQUEST });
        if (!req.query.quality) throw Object.assign(new Error("Quality is not provided"), { statusCode: https_codes.BAD_REQUEST });
        if (!req.query.format) throw Object.assign(new Error("Format is not provided"), { statusCode: https_codes.BAD_REQUEST });

        const url = req.query.url;
        const quality = req.query.quality;
        const format = req.query.format;
        const user_id = req.session.user_id;

        // Create a new record
        record = new RequestsRecord({
            sender_id: user_id,
            format: 'video',
            status: 'Pending',
            url: url,
            timestamp: new Date(),
            deviceType: req.device.type.toUpperCase(),
            OS_Name: getUserOS(req.headers['user-agent']),
            sender_token: req.body.accessKey, // Replace with actual session token
            sender_ip_address: req.ip,
            sender_user_agent: req.headers['user-agent']
        });

        await record.save();

        // Find User & push record in it 'requestRecordArray'
        const user = await User.findById(user_id);
        user.requestsRecord.push(record.id);
        await user.save();

        if (url) {
            res.header('Content-Disposition', 'attachment; filename="video.mp4"');
            ytdl(url, { format: format, quality: quality }).pipe(res);

            // Update the record status to 'Succeed'
            record.status = 'Succeed';
            user.total_number_of_succeed_requests += 1;

            await record.save();
            await user.save();

        } else {
            throw Object.assign(new Error("Please provide a URL query parameter"), { statusCode: https_codes.BAD_REQUEST });
        }

    } catch (error) {
        // Update the record status to 'Failed'
        if (record) {
            record.status = 'Failed';
            await record.save();
        }
        console.error(error)
        next(new Error(`Error from server on downloading video: ${error.message}`));
    }
}

export async function getAudio(req, res, next) {
    let record;
    try {
        if (!req.query) throw Object.assign(new Error("Query not provided"), { statusCode: https_codes.BAD_REQUEST });
        if (!req.query.url) throw Object.assign(new Error("Url is not provided"), { statusCode: https_codes.BAD_REQUEST });
        if (!req.query.url.includes('youtube.com')) throw Object.assign(new Error("Provide url only for youtube"), { statusCode: https_codes.BAD_REQUEST });
        if (!req.query.format) throw Object.assign(new Error("Format is not provided"), { statusCode: https_codes.BAD_REQUEST });

        const url = req.query.url;
        const format = req.query.format;
        const user_id = req.session.user_id;

        // Create a new record
        record = new RequestsRecord({
            sender_id: user_id,
            format: 'audio',
            status: 'Pending',
            url: url,
            timestamp: new Date(),
            deviceType: req.device.type.toUpperCase(),
            OS_Name: getUserOS(req.headers['user-agent']),
            sender_token: req.body.accessKey, // Replace with actual session token
            sender_ip_address: req.ip,
            sender_user_agent: req.headers['user-agent']
        });

        await record.save();

        // Find User & push record in it 'requestRecordArray'
        const user = await User.findById(user_id);
        user.requestsRecord.push(record.id);
        await user.save();


        if (url) {
            res.header('Content-Disposition', 'attachment; filename="audio.mp3"');
            ytdl(url, { filter: 'audioonly', format: format }).pipe(res);

            // Update the record status to 'Succeed'
            record.status = 'Succeed';
            user.total_number_of_succeed_requests += 1;

            await user.save()
            await record.save();

        } else {
            throw Object.assign(new Error("Please provide a URL query parameter"), { statusCode: https_codes.BAD_REQUEST });
        }
    } catch (error) {
        // Update the record status to 'Failed'
        if (record) {
            record.status = 'Failed';
            await record.save();
        }
        console.error(error)
        next(new Error(`Error from server on downloading audio: ${error.message}`));
    }
}

export async function getInfo(req, res, next) {
    try {
        if (!req.query) throw Object.assign(new Error("Query not provided"), { statusCode: https_codes.BAD_REQUEST });
        if (!req.query.url) throw Object.assign(new Error("Url is not provided"), { statusCode: https_codes.BAD_REQUEST });
        if (!req.query.url.includes('youtube.com')) throw Object.assign(new Error("Provide url only for youtube"), { statusCode: https_codes.BAD_REQUEST });

        const url = req.query.url;
        const videoId = ytdl.getURLVideoID(url);

        if (url) {
            let info = await ytdl.getInfo(videoId);
            let dataToReturn;

            if (info) {
                dataToReturn = { title: info.videoDetails.title, description: info.videoDetails.description, keywords: info.videoDetails.keywords, category: info.videoDetails.category, publishedDate: info.videoDetails.publishDate, uploadedDate: info.videoDetails.uploadDate, Author: { name: info.videoDetails.author.name, user: info.videoDetails.author.user } }
            }

            res.status(https_codes.SUCCESS).json({ success: true, data: dataToReturn });

        } else {
            throw Object.assign(new Error("Please provide a URL query parameter"), { statusCode: https_codes.BAD_REQUEST });
        }
    } catch (error) {
        console.error(error)
        next(new Error(`Error from server on downloading audio: ${error.message}`));
    }
}

function getUserOS(userAgent) {
    if (/Mac OS X/.test(userAgent)) {
        return "macOS"
    } else if (/Windows/.test(userAgent)) {
        return "Windows"
    } else if (/Linux/.test(userAgent)) {
        return "Linux"
    } else {
        return "Unknown OS"
    }
}