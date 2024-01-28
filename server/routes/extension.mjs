import express from 'express';
import { getVideo, getAudio } from '../controller/extension.mjs';
import { checkAccessKey } from '../middleware/checkAccessKey.mjs';

const extensionRoute = express.Router();

// ROUTE 1 : Get video
extensionRoute.post('/downloadVideo', checkAccessKey, getVideo);

// ROUTE 2 : Get audio
extensionRoute.post('/downloadAudio', checkAccessKey, getAudio);


export default extensionRoute;