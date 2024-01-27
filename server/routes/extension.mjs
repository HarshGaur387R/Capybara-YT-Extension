import express from 'express';
import { body, validationResult } from 'express-validator';
import https_codes from '../config/http_code.mjs';
import { getVideo, getAudio } from '../controller/extension.mjs';

const extensionRoute = express.Router();

// ROUTE 1 : Get video
extensionRoute.get('/downloadVideo', getVideo);

// ROUTE 2 : Get audio
extensionRoute.get('/downloadAudio',  getAudio);


export default extensionRoute;