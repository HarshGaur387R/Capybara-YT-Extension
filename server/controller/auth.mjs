import userSchema from '../models/User.mjs';
import https_codes from '../config/http_code.mjs';
import configs from '../config/config.mjs';
import bcrypt from 'bcrypt'
import { sendEmailVerificationCode } from '../module/EmailVerification.mjs';
import generateVerificationCode from '../module/generateVerificationCode.mjs'
import jsonwebtoken from 'jsonwebtoken'

const jwt = jsonwebtoken;

// CREATE Operation for User
export async function signupController(req, res) {

    try {
        const user = await userSchema.findOne({ email: req.body.email });
        if (user) return res.status(https_codes.CONFLICT_ERROR).json({ success: false, error: { msg: "Email address is already taken." } });

        const salt = await bcrypt.genSalt(configs.SALT_ROUND);
        const passwordHash = await bcrypt.hash(req.body.password, salt);

        const data = { name: req.body.name, email: req.body.email, password: passwordHash, lastLogin: Date.now() };
        req.session.user = data;

        const { verificationCode, token } = generateVerificationCode(6);
        req.session.token = token;

        const result = await sendEmailVerificationCode(req.body.email, verificationCode);
        if (!result) return res.status(https_codes.SERVER_ERROR).json({ success: false, error: { msg: "Failed To Send Email" } });

        return res.status(https_codes.SUCCESS).json({ success: true, msg: "Verify email to continue" });

    } catch (error) {
        console.error('error on signing-up user: ', error);
        return res.status(https_codes.SERVER_ERROR).json({ success: false, error: { msg: "Error from server on signup" } });
    }
}

// READ Operation for User

export async function loginController(req, res) {

    try {
        const user = await userSchema.findOne({ email: req.body.email });
        if (!user) return res.status(https_codes.NOT_FOUND_ERROR).json({ success: false, error: { msg: "Incorrect credentials" } });

        const compareResults = await bcrypt.compare(req.body.password, user.password);
        if (!compareResults) return res.status(https_codes.UNAUTH_ERROR).json({ success: false, error: { msg: "Incorrect credentials" } });

        user.lastLogin = Date.now();
        await user.save();

        req.session.user = user;
        return res.status(https_codes.SUCCESS).json({ success: true, msg: "Logged-in successfully" });

    } catch (error) {
        console.error('error on logging-in user: ', error);
        return res.status(https_codes.SERVER_ERROR).json({ success: false, error: { msg: "error from server on login" } });
    }
}

// DELETE Operation for user

export async function signOutUser(req, res) {
    try {
        if (!req.session) return res.status(https_codes.BAD_REQUEST).json({ success: false, msg: "No user found" });
        await req.session.destroy();
        return res.status(https_codes.SUCCESS).json({ success: true, msg: "SignOut successful" });
    } catch (error) {
        console.error('Error from signout', error);
        return res.status(https_codes.SERVER_ERROR).json({ success: false, msg: "failed to SignOut" });
    }
}

// UPDATE Operation for user

export async function forgetPassword(req, res) {
    try {

        if (!req.session) { return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Error on gathering user data Please login again." } }) }
        if (!req.body.email) { return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Email not found." } }) }
        if (!req.body.password) { return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Password is not provided" } }) }

        const salt = await bcrypt.genSalt(configs.SALT_ROUND);
        const passwordHash = await bcrypt.hash(req.body.password, salt);

        const userEmail = req.body.email;
        let user = await userSchema.findOne({ email: userEmail });
        if (!user) return res.status(https_codes.CONFLICT_ERROR).json({ success: false, error: { msg: "User not found" } });

        const { verificationCode, token } = generateVerificationCode(6);
        req.session.token = token;
        req.session.newPassword = passwordHash;
        req.session.email = userEmail

        const result = await sendEmailVerificationCode(userEmail, verificationCode);
        if (!result) return res.status(https_codes.SERVER_ERROR).json({ success: false, error: { msg: "Failed To Send Email" } });

        return res.status(https_codes.SUCCESS).json({ success: true, msg: "Verify your email to change password" });

    } catch (error) {
        console.error("error on changing user's password: ", error);
        return res.status(https_codes.SERVER_ERROR).json({ success: false, error: { msg: "Error from server on changing user's password" } });
    }
}

// READ Operation for user 

export async function verifyAccessKey(req, res) {
    try {

        if (!req.body.accessKey) { return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Error on gathering user data. Please login again." } }) }
        const accessKey = req.body.accessKey;

        const id = jwt.verify(accessKey, configs.ACCESS_KEY_SECRET)._id;

        const user = await userSchema.findById(id);
        if (!user) { return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Invalid accessKey. No user authorized with this key" } }) };
        if (user.accessKey !== accessKey) return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Invalid accessKey. This key is not authorized to any user" } });

        return res.status(https_codes.SUCCESS).json({ success: true, msg: "Authorized" });
    } catch (error) {
        console.error('error on verifying accessToken: ', error);
        return res.status(https_codes.SERVER_ERROR).json({ success: false, error: "Error from server on verifying AccessToken" });
    }
}