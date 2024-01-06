import https_codes from '../config/http_code.mjs';
import bcrypt from 'bcrypt';
import configs from '../config/config.mjs';
import { sendEmailVerificationCode } from '../module/EmailVerification.mjs';
import generateVerificationCode from '../module/generateVerificationCode.mjs';
import userSchema from '../models/User.mjs'

export async function myData(req, res) {
    try {
        const user = req.session.user;
        return res.status(https_codes.SUCCESS).json({ success: true, data: user });

    } catch (error) {
        console.error('error on creating myData', error);
        return res.status(https_codes.SERVER_ERROR).json({ success: false, error: "error from server" });
    }
}

export async function updateEmail(req, res) {
    try {

        if (!req.session) { return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Error on gathering user data Please login again." } }) }
        if (!req.session.user) { return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Error on gathering user data Please login again." } }) }

        const { verificationCode, token } = generateVerificationCode(6);
        req.session.token = token;

        const oldEmail = req.session.user.email;
        let user = await userSchema.findOne({ email: oldEmail });
        if (!user) return res.status(https_codes.CONFLICT_ERROR).json({ success: false, error: { msg: "User not found" } });

        const newEmail = req.body.email;
        user = await userSchema.findOne({ email: newEmail });
        if (user) return res.status(https_codes.CONFLICT_ERROR).json({ success: false, error: { msg: "Email is already taken" } });

        const result = await sendEmailVerificationCode(newEmail, verificationCode);
        if (!result) return res.status(https_codes.SERVER_ERROR).json({ success: false, error: { msg: "Failed To Send Email" } });

        req.session.newEmail = newEmail;
        return res.status(https_codes.SUCCESS).json({ success: true, msg: "Verify email to update" });

    } catch (error) {
        console.error('error on updating email user: ', error);
        return res.status(https_codes.SERVER_ERROR).json({ success: false, error: { msg: "Error from server on updating user's email" } });
    }
}

export async function changePassword(req, res) {
    try {

        if (!req.session) { return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Error on gathering user data Please login again." } }) }
        if (!req.session.user) { return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Error on gathering user data Please login again." } }) }
        if (!req.session.user.email) { return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Email not found." } }) }
        if (!req.body.password) { return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Password is not provided" } }) }

        const salt = await bcrypt.genSalt(configs.SALT_ROUND);
        const passwordHash = await bcrypt.hash(req.body.password, salt);

        const userEmail = req.session.user.email;
        let user = await userSchema.findOne({ email: userEmail });
        if (!user) return res.status(https_codes.CONFLICT_ERROR).json({ success: false, error: { msg: "User not found" } });

        const { verificationCode, token } = generateVerificationCode(6);
        req.session.token = token;
        req.session.newPassword = passwordHash;

        const result = await sendEmailVerificationCode(userEmail, verificationCode);
        if (!result) return res.status(https_codes.SERVER_ERROR).json({ success: false, error: { msg: "Failed To Send Email" } });

        return res.status(https_codes.SUCCESS).json({ success: true, msg: "Verify your email to update password" });

    } catch (error) {
        console.error("error on changing user's password: ", error);
        return res.status(https_codes.SERVER_ERROR).json({ success: false, error: { msg: "Error from server on changing user's password" } });
    }
}

export async function updateUser(req, res) {
    try {
        const { name, email, password } = req.body;
        const user = req.user;
        const data = {}

        if (password) {
            const salt = await bcrypt.genSalt(configs.SALT_ROUND);
            const passwordHash = await bcrypt.hash(req.body.password, salt);
            data.name = name
            data.email = email
            data.password = passwordHash
        }
        else {
            data.name = name;
            data.email = email;
        }

        user.updateOne(data).select('-password').then((updatedUser) => {
            return res.status(https_codes.SUCCESS).json({ success: true, data: updatedUser });
        }).catch((error) => {
            console.error('error from updateUser\'s updateOne function:', error);
            return res.status(https_codes.SERVER_ERROR).json({ success: false, error: "error on updating user." });
        })
    } catch (error) {
        console.error('error from updateUser catch statement:', error);
        return res.status(https_codes.SERVER_ERROR).json({ success: false, error: "error from server." });
    }
}