import express from 'express';
import { tokenAuthenticator } from '../middleware/tokenAuthenticator.mjs';
import { myData, updateUser } from '../controller/user.mjs';
import { body, validationResult } from 'express-validator';
import https_codes from '../config/http_code.mjs';
import { passValidUser } from '../middleware/passValidUser.mjs';
import { verify_csrf_token } from '../middleware/csrfToken.mjs';
const userRoute = express.Router();

// ROUTE 1 : myData route , Login required.
userRoute.get('/my-data', passValidUser, myData);

// ROUTE 2 : update user route , Login required.
userRoute.put('/update', tokenAuthenticator, [
    body("email", 'Enter a valid email').isEmail(),
    body("name", 'Name must be at least 3 characters').isLength({ min: 3 })
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(https_codes.BAD_REQUEST).json({ error: errors.array() });
    }
    next();
}, passValidUser, updateUser);

export default userRoute;