import userSchema from '../models/User.mjs';
import https_codes from '../config/http_code.mjs';
import configs from '../config/config.mjs';
import bcrypt from 'bcrypt'
import { sendEmailVerificationCode } from '../module/EmailVerification.mjs';
import generateVerificationCode from '../module/generateVerificationCode.mjs'
import jsonwebtoken from 'jsonwebtoken'
import NewsLatterSubs from '../models/NewsLatterSubs.mjs';

const jwt = jsonwebtoken;

// CREATE Operation for User
export async function signupController(req, res, next) {

    try {
        const user = await userSchema.findOne({ email: req.body.email });
        if (user) throw Object.assign(new Error("Email address is already taken."), { statusCode: https_codes.CONFLICT_ERROR })

        const salt = await bcrypt.genSalt(configs.SALT_ROUND);
        const passwordHash = await bcrypt.hash(req.body.password, salt);

        const data = { name: req.body.name, email: req.body.email, password: passwordHash, lastLogin: Date.now() };
        req.session.user = data;

        const { verificationCode, token } = generateVerificationCode(6);
        req.session.token = token;

        const result = await sendEmailVerificationCode(req.body.email, verificationCode);
        if (!result) throw Object.assign(new Error("Failed To Send Email"), { statusCode: https_codes.SERVER_ERROR });

        req.session.permissionForEVS = true
        return res.status(https_codes.SUCCESS).json({ success: true, msg: "Verify email to continue" });

    } catch (error) {
        console.error(error);
        next(new Error("Error from server on signup"))
    }
}


// WRITE Operation for User (signup is required)
export async function resendCode(req, res, next) {
    try {
        if (!req.session) throw Object.assign(new Error("Error on gathering user data. Please signup again."), { statusCode: https_codes.BAD_REQUEST });
        if (!req.session.user) throw Object.assign(new Error("Error on gathering user data. Please signup again."), { statusCode: https_codes.BAD_REQUEST });
        if (!req.session.user.email) throw Object.assign(new Error("Error on gathering user data. Please signup again."), { statusCode: https_codes.BAD_REQUEST });

        const { verificationCode, token } = generateVerificationCode(6);
        req.session.token = token;

        const result = await sendEmailVerificationCode(req.session.user.email, verificationCode);
        if (!result) throw Object.assign(new Error("Failed To Send Email"), { statusCode: https_codes.SERVER_ERROR });

        return res.status(https_codes.SUCCESS).json({ success: true, msg: "Code is re-sended to user's email" });

    } catch (error) {
        console.error(error);
        next(new Error('Error from server on resending code'));
    }
}

// READ Operation for User
export async function loginController(req, res, next) {
    try {
        const user = await userSchema.findOne({ email: req.body.email });
        if (!user) throw Object.assign(new Error("Incorrect credentials"), { statusCode: https_codes.UNAUTH_ERROR });

        const compareResults = await bcrypt.compare(req.body.password, user.password);
        if (!compareResults) throw Object.assign(new Error("Incorrect credentials"), { statusCode: https_codes.UNAUTH_ERROR });

        user.lastLogin = Date.now();
        await user.save();

        req.session.user = user;
        return res.status(https_codes.SUCCESS).json({ success: true, msg: "Logged-in successfully" });

    } catch (error) {
        console.error(error);
        next(new Error('Error from server on login'));
    }
}


// DELETE Operation for user
export async function signOutUser(req, res, next) {
    try {
        if (!req.session) throw Object.assign(new Error("No user found"), { statusCode: https_codes.NOT_FOUND_ERROR });
        await req.session.destroy();
        return res.status(https_codes.SUCCESS).json({ success: true, msg: "SignOut successful" });
    } catch (error) {
        console.error(error);
        next(new Error('Error from signout'));
    }
}

// UPDATE Operation for user
export async function forgetPassword(req, res, next) {
    try {
        if (!req.session) throw Object.assign(new Error("Error on gathering user data. Please login again."), { statusCode: https_codes.BAD_REQUEST });
        if (!req.body.email) throw Object.assign(new Error("Email not found."), { statusCode: https_codes.BAD_REQUEST });
        if (!req.body.password) throw Object.assign(new Error("Password is not provided"), { statusCode: https_codes.BAD_REQUEST });

        const salt = await bcrypt.genSalt(configs.SALT_ROUND);
        const passwordHash = await bcrypt.hash(req.body.password, salt);

        const userEmail = req.body.email;
        let user = await userSchema.findOne({ email: userEmail });
        if (!user) throw Object.assign(new Error("User not found"), { statusCode: https_codes.NOT_FOUND_ERROR });

        const { verificationCode, token } = generateVerificationCode(6);
        req.session.token = token;
        req.session.newPassword = passwordHash;
        req.session.email = userEmail
        req.session.permissionForFPEVS = true;

        const result = await sendEmailVerificationCode(userEmail, verificationCode);
        if (!result) throw Object.assign(new Error("Failed To Send Email"), { statusCode: https_codes.SERVER_ERROR });

        return res.status(https_codes.SUCCESS).json({ success: true, msg: "Verify your email to change password" });

    } catch (error) {
        console.error(error);
        next(new Error("error on changing user's password: "))
    }
}

// READ Operation for user 
export async function verifyAccessKey(req, res, next) {
    try {
        if (!req.body.accessKey) throw Object.assign(new Error("Error on gathering user data. Please login again."), { statusCode: https_codes.BAD_REQUEST });
        const accessKey = req.body.accessKey;

        const id = jwt.verify(accessKey, configs.ACCESS_KEY_SECRET)._id;

        const user = await userSchema.findById(id);
        if (!user) throw Object.assign(new Error("Invalid accessKey. No user authorized with this key"), { statusCode: https_codes.UNAUTH_ERROR });
        if (user.accessKey !== accessKey) throw Object.assign(new Error("Invalid accessKey. This key is not authorized to any user"), { statusCode: https_codes.UNAUTH_ERROR });

        return res.status(https_codes.SUCCESS).json({ success: true, msg: "Authorized" });
    } catch (error) {
        console.error(error);
        next(new Error('error on verifying accessToken: '));
    }
}


// WRITE Operation for user (no login and signup required);
export async function SubscribeNewsLatter(req, res, next) {
    try {
        if (!req.body.email) throw Object.assign(new Error("Please provide valid email"), { statusCode: https_codes.BAD_REQUEST });

        const subscriber = await NewsLatterSubs.findOne({ 'email': req.body.email });
        if (subscriber) throw Object.assign(new Error("Already Subscribed"), { statusCode: https_codes.CONFLICT_ERROR });

        const sub = await NewsLatterSubs.create({ email: req.body.email });
        if (!sub) throw Object.assign(new Error("Error on subscribing. Please try again."), { statusCode: https_codes.SERVER_ERROR });

        return res.status(https_codes.SUCCESS).json({ success: true, msg: "Thank you for subscribing" });
    } catch (error) {
        console.error(error);
        next(new Error('error on subscribing news latter: '));
    }
}
