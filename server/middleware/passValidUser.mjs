import https_codes from "../constants/http_code.mjs";
import userSchema from '../models/User.mjs'
// import configs from "../config/config.mjs";
import jsonwebtoken from 'jsonwebtoken';

const jwt = jsonwebtoken;

export async function passValidUser(req, res, next) {

    try {

        if (!req.session) return res.status(https_codes.UNAUTH_ERROR).json({ success: false, error: { msg: "Not permitted to perform this action. Please login" } })
        else if (!req.session.user) return res.status(https_codes.UNAUTH_ERROR).json({ success: false, error: { msg: "User not found. Please login again" } })

        const id = req.session.user._id;
        if (!id) return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Incorrect token is provided" } });

        const user = await userSchema.findById(id.toString()).select('-password');
        if (!user) return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Incorrect token is provided" } });

        req.session.user = user;
        next();

    } catch (error) {
        console.error('error from passValidUser\'s catch statement:', error);
        return res.status(https_codes.SERVER_ERROR).json({ success: false, error: "error from server." });
    }
}