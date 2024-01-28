import ytdl from "ytdl-core";
import https_codes from "../config/http_code.mjs";
import fs from 'fs'

const MAX_VIDEO_LENGTH = 6; // In minutes.

export async function getVideo(req, res) {
    if (!req.query) return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Query not provided" } });
    if (!req.query.url) return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Url is not provided" } });
    if (!req.query.url.includes('youtube.com')) return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Provide url only for youtube" } });
    if (!req.query.quality) return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Quality is not provided" } });
    if (!req.query.format) return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Format is not provided" } });

    const url = req.query.url;
    const videoId = ytdl.getURLVideoID(url);
    const quality = req.query.quality;
    const format = req.query.format;

    try {
        if (url) {
            res.header('Content-Disposition', 'attachment; filename="video.mp4"');
            ytdl(url, { format: format, quality: quality }).pipe(res);

        } else {
            res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Please provide a URL query parameter" } });
        }

    } catch (error) {
        console.error('error on downloading video: ', error);
        return res.status(https_codes.SERVER_ERROR).json({ success: false, error: { msg: "Error from server on downloading video" } });
    }
}


export async function getAudio(req, res) {

    if (!req.query) return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Query not provided" } });
    if (!req.query.url) return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Url is not provided" } });
    if (!req.query.url.includes('youtube.com')) return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Provide url only for youtube" } });
    if (!req.query.format) return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Format is not provided" } });

    const url = req.query.url;
    const videoId = ytdl.getURLVideoID(url);
    const format = req.query.format;

    try {
        if (url) {
            res.header('Content-Disposition', 'attachment; filename="audio.mp3"');
            ytdl(url, { filter: 'audioonly', format: format }).pipe(res);
        } else {
            res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Please provide a URL query parameter" } });
        }
    } catch (error) {
        console.error("error on downloading audio: ", error);
        return res.status(https_codes.SERVER_ERROR).json({ success: false, error: { msg: "Error from server on downloading audio" } });
    }
}