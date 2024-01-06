import express from 'express';
import { changePassword, myData, updateEmail } from '../controller/user.mjs';
import { body, validationResult } from 'express-validator';
import https_codes from '../config/http_code.mjs';
import { passValidUser } from '../middleware/passValidUser.mjs';
import { verify_csrf_token } from '../middleware/csrfToken.mjs';
import { verifyEmailVerificationCode } from '../module/EmailVerification.mjs';
import { updateEmail2 } from '../module/updateEmail.mjs';
import { changePassword2 } from '../module/changePassword.mjs';

const userRoute = express.Router();

// ROUTE 1 : myData route , Login required.
userRoute.get('/my-data', passValidUser, myData);

// ROUTE 2 : update user route , Login required.
userRoute.put('/updateEmail', [
    body("email", 'Enter a valid email').isEmail(),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(https_codes.BAD_REQUEST).json({ error: errors.array() });
    }
    next();
}, passValidUser, updateEmail);

// ROUTE 3 : verify and then update user's email.
userRoute.post('/verifyEmailToUpdate', passValidUser, await verifyEmailVerificationCode(updateEmail2));

// ROUTE 4 : update user's password.
userRoute.put('/updatePassword', [
    body("password", 'Password must be at least 8 characters').isLength({ min: 8 })
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(https_codes.BAD_REQUEST).json({ error: errors.array() });
    }
    next();
}, passValidUser,changePassword);

// ROUTE 5: verify and then update user's password.
userRoute.post('/verifyEmailToUpdatePassword', passValidUser, await verifyEmailVerificationCode(changePassword2));

export default userRoute;