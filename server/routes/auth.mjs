import express from 'express';
import { forgetPassword, loginController, signOutUser, signupController } from '../controller/auth.mjs';
import { body, validationResult } from 'express-validator';
import https_codes from '../config/http_code.mjs';
import { verifyEmailVerificationCode } from '../module/EmailVerification.mjs';
import { createUser } from '../module/createUser.mjs';
import { changePassword2 } from '../module/changePassword.mjs';
import { forgetPassword2 } from '../module/forgetPassword.mjs';

const authRoute = express.Router();

// ROUTE 1 : Login user
authRoute.post('/login', [
    body("email", 'Enter a valid email').isEmail(),
    body("password", 'Password must be at least 8 characters').isLength({ min: 8 })
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(https_codes.BAD_REQUEST).json({ error: errors.array() });
    }
    next();
}, loginController);

// ROUTE 2 : Signup user
authRoute.post('/signup', [
    body("name", 'Enter a valid name').isLength({ min: 3 }),
    body("email", 'Enter a valid email').isEmail(),
    body("password", 'Password must be at least 8 characters').isLength({ min: 8 })
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(https_codes.BAD_REQUEST).json({ error: errors.array() });
    }
    next();
}, signupController);

// ROUTE 3 : verifyEmail
authRoute.post('/verifyEmail', [
    body("verificationCode", "Incorrect verification code").isLength({ min: 6 }).isLength({ max: 6 })
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(https_codes.BAD_REQUEST).json({ error: errors.array() });
    }
    next();
}, await verifyEmailVerificationCode(createUser));


// ROUTE 4 : signout user
authRoute.post('/signout', signOutUser);


// ROUTE 5 : forget password
authRoute.put('/forgetPassword', [
    body("email", 'Enter a valid email').isEmail(),
    body("password", 'Password must be at least 8 characters').isLength({ min: 8 })
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(https_codes.BAD_REQUEST).json({ error: errors.array() });
    }
    next();
}, forgetPassword)


// ROUTE 6 : Verify and then change password
authRoute.post('/verifyEmailToChangePassword', await verifyEmailVerificationCode(forgetPassword2));

export default authRoute;