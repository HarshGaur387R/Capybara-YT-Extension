import express from 'express';
import { changePassword, generateAccessKey, getAccessTokenUsers, getCurrentAccessKey, getRequestRecordData, getTotalRequests, myData, updateEmail, updateUserName } from '../controller/user.mjs';
import { body, validationResult } from 'express-validator';
import https_codes from '../config/http_code.mjs';
import { passValidUser } from '../middleware/passValidUser.mjs';
import { verifyEmailVerificationCode } from '../module/EmailVerification.mjs';
import { updateEmail2 } from '../module/updateEmail.mjs';
import { changePassword2 } from '../module/changePassword.mjs';
import { signOutUser } from '../controller/auth.mjs';

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

// ROUTE 6: Update user Name.
userRoute.put("/updateUserName", passValidUser , updateUserName);

// ROUTE 7: Update or generate
userRoute.put('/generateAccessKey', passValidUser, generateAccessKey);

// ROUTE 8: Read current Access Key
userRoute.get('/getAccessKey', passValidUser, getCurrentAccessKey);

// ROUTE 9: Read request records number
userRoute.get('/getTotalRequestsRecord', passValidUser, getTotalRequests);

// ROUTE 10 : Read request data
userRoute.get('/getRequestsRecordData', passValidUser, getRequestRecordData);

// ROUTE 11 : Read access token users 
userRoute.get('/getAccessTokenUsers', passValidUser, getAccessTokenUsers);

// ROUTE 12 : signout user
userRoute.post('/signout', passValidUser, signOutUser);

export default userRoute;