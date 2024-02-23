import express from 'express';
import { getVideo, getAudio, getInfo } from '../controller/extension.mjs';
import { checkAccessKey } from '../middleware/checkAccessKey.mjs';

const extensionRoute = express.Router();

// ROUTE 1 : Get video
extensionRoute.post('/downloadVideo', checkAccessKey, getVideo);

// ROUTE 2 : Get audio
extensionRoute.post('/downloadAudio', checkAccessKey, getAudio);

// ROUTE 3 : Get Info
extensionRoute.post('/getInfo', checkAccessKey, getInfo);


export default extensionRoute;