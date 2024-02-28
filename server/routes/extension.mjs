import express from 'express';
import { getVideo, getAudio, getInfo } from '../controller/extension.mjs';
import { checkAccessKey } from '../middleware/checkAccessKey.mjs';
import { body, validationResult } from 'express-validator';

const extensionRoute = express.Router();

// ROUTE 1 : Get video
extensionRoute.post('/downloadVideo', [
    body("accessKey", 'Enter valid accessKey').isEmpty().isString().trim().escape()
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(https_codes.BAD_REQUEST).json({ error: errors.array() });
    }
    next();
}, checkAccessKey, getVideo);

// ROUTE 2 : Get audio
extensionRoute.post('/downloadAudio', [
    body("accessKey", 'Enter valid accessKey').isEmpty().isString().trim().escape()
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(https_codes.BAD_REQUEST).json({ error: errors.array() });
    }
    next();
}, checkAccessKey, getAudio);

// ROUTE 3 : Get Info
extensionRoute.post('/getInfo', [
    body("accessKey", 'Enter valid accessKey').isEmpty().isString().trim().escape()
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(https_codes.BAD_REQUEST).json({ error: errors.array() });
    }
    next();
}, checkAccessKey, getInfo);

export default extensionRoute;