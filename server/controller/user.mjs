import https_codes from '../constants/http_code.mjs';
import bcrypt from 'bcrypt';
// import configs from '../config/config.mjs';
import { sendEmailVerificationCode } from '../module/EmailVerification.mjs';
import generateVerificationCode from '../module/generateVerificationCode.mjs';
import userSchema from '../models/User.mjs'
import jsonwebtoken from 'jsonwebtoken'
import User from '../models/User.mjs';

const jwt = jsonwebtoken;

export async function myData(req, res, next) {
    try {
        const user = req.session.user;
        return res.status(https_codes.SUCCESS).json({ success: true, data: user });

    } catch (error) {
        console.error('error on creating myData', error);
        next(new Error(`Error from server on fetching my data: ${error.message}`));
    }
}

export async function updateEmail(req, res, next) {
    try {

        if (!req.session) throw Object.assign(new Error("Error on gathering user data. Please login again."), { statusCode: https_codes.BAD_REQUEST });
        if (!req.session.user) throw Object.assign(new Error("Error on gathering user data. Please login again."), { statusCode: https_codes.BAD_REQUEST });

        const { verificationCode, token } = generateVerificationCode(6);
        req.session.token = token;

        const oldEmail = req.session.user.email;
        let user = await userSchema.findOne({ email: oldEmail });
        if (!user) throw Object.assign(new Error("User not found"), { statusCode: https_codes.CONFLICT_ERROR });

        const newEmail = req.body.email;
        user = await userSchema.findOne({ email: newEmail });
        if (user) throw Object.assign(new Error("Email is already taken"), { statusCode: https_codes.CONFLICT_ERROR });

        const result = await sendEmailVerificationCode(newEmail, verificationCode);
        if (!result) throw Object.assign(new Error("Failed To Send Email"), { statusCode: https_codes.SERVER_ERROR });

        req.session.newEmail = newEmail;
        return res.status(https_codes.SUCCESS).json({ success: true, msg: "Verify email to update" });

    } catch (error) {
        console.error('error on updating email user: ', error);
        next(new Error(`Error from server on updating user's email: ${error.message}`));
    }
}

export async function changePassword(req, res, next) {
    try {

        if (!req.session) throw Object.assign(new Error("Error on gathering user data. Please login again."), { statusCode: https_codes.BAD_REQUEST });
        if (!req.session.user) throw Object.assign(new Error("Error on gathering user data. Please login again."), { statusCode: https_codes.BAD_REQUEST });
        if (!req.session.user.email) throw Object.assign(new Error("Email not found."), { statusCode: https_codes.BAD_REQUEST });
        if (!req.body.password) throw Object.assign(new Error("Password is not provided"), { statusCode: https_codes.BAD_REQUEST });

        const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUND));
        const passwordHash = await bcrypt.hash(req.body.password, salt);

        const userEmail = req.session.user.email;
        let user = await userSchema.findOne({ email: userEmail });
        if (!user) throw Object.assign(new Error("User not found"), { statusCode: https_codes.CONFLICT_ERROR });

        const { verificationCode, token } = generateVerificationCode(6);
        req.session.token = token;
        req.session.newPassword = passwordHash;
        req.session.permissionForEVS = true;

        const result = await sendEmailVerificationCode(userEmail, verificationCode);
        if (!result) throw Object.assign(new Error("Failed To Send Email"), { statusCode: https_codes.SERVER_ERROR });

        return res.status(https_codes.SUCCESS).json({ success: true, msg: "Verify your email to update password" });

    } catch (error) {
        console.error("error on changing user's password: ", error);
        next(new Error(`Error from server on changing user's password ${error.message}`));
    }
}


export async function updateUserName(req, res, next) {
    try {
        if (!req.session) throw new Error("Error on finding user. Please login again.");

        const id = req.session.user._id;
        const name = req.body.name;

        userSchema.findByIdAndUpdate(id, { name: name }, { new: true }).then((updatedUser) => {
            req.session.user = updatedUser;
            return res.status(https_codes.SUCCESS).json({ success: true, msg: "Username updated successfully" });
        }).catch((error) => {
            console.error('error from updateUserName\'s updateOne function:', error);
            throw new Error("error on updating user's name.");
        });
    } catch (error) {
        console.error('error from updateUserName catch statement:', error);
        next(new Error(`Error from on updating name: ${error.message}`));
    }
}

// UPDATE Operation for user 

export async function generateAccessKey(req, res, next) {
    try {
        if (!req.session.user._id) {
            throw Object.assign(new Error("Error on gathering user id. Please login again."), { statusCode: https_codes.BAD_REQUEST });
        }

        const user = req.session.user;
        const _id = user._id;

        const accessKey = jwt.sign({ _id }, process.env.ACCESS_KEY_SECRET);
        let newUser = await userSchema.findById(_id);

        if (!newUser) throw Object.assign(new Error("User not found"), { statusCode: https_codes.UNAUTH_ERROR });

        newUser.accessKey = accessKey;
        await newUser.save();

        req.session.user = newUser;

        return res.status(https_codes.SUCCESS).json({ success: true, data: { accessKey } });

    } catch (error) {
        console.error("error on creating access token: ", error);
        next(new Error(`Error from server on creating access token: ${error.message}`))
    }
}


// GET CURRENT ACCESSKEY CODE

export async function getCurrentAccessKey(req, res, next) {
    try {
        if (!req.session.user && !req.session.user.accessKey) {
            throw Object.assign(new Error("Error on gathering user id. Please try again."), { statusCode: https_codes.BAD_REQUEST });
        }

        const accessKey = req.session.user.accessKey;

        return res.status(https_codes.SUCCESS).json({ success: true, data: { accessKey } });

    } catch (error) {
        console.error("error on gathering access key: ", error);
        next(new Error(`Error from server on gathering access key: ${error.message}`));
    }
}

// GET REQUESTS RECORD 

export async function getTotalRequests(req, res, next) {
    try {
        if (!req.session.user) {
            throw Object.assign(new Error("Error on gathering user id. Please try again."), { statusCode: https_codes.BAD_REQUEST });
        }

        const user = req.session.user;
        const totalRequests = user.requestsRecord.length;
        const succeedRequests = user.total_number_of_succeed_requests;
        const failedRequests = totalRequests - succeedRequests;

        return res.status(https_codes.SUCCESS).json({ success: true, data: { totalRequests, succeedRequests, failedRequests } });

    } catch (error) {
        console.error("error on gathering requests record: ", error);
        next(new Error(`Error from server on gathering requests record: ${error.message}`));
    }
}

export async function getRequestRecordData(req, res, next) {
    try {
        const user_id = req.session.user._id;
        const user = await User.findById(user_id).populate('requestsRecord');

        if (!user) {
            throw Object.assign(new Error("Error on gathering user information."), { statusCode: https_codes.BAD_REQUEST });
        }

        const data = {};

        for (let record of user.requestsRecord) {
            const date = record.timestamp.toISOString().split('T')[0];

            if (!data[date]) {
                data[date] = { request: 0 }
            }
            data[date].request += 1;
        }

        // Send the response
        res.status(https_codes.SUCCESS).json({ data });

    } catch (error) {
        console.error("error on gathering requests record to struct date: ", error);
        next(new Error(`Error from server on gathering requests record to struct data: ${error.message}`));
    }
}

export async function getAccessTokenUsers(req, res, next) {
    try {
        const user_id = req.session.user._id;
        const user = await User.findById(user_id).populate('requestsRecord');

        if (!user) {
            throw Object.assign(new Error("Error on gathering user information."), { statusCode: https_codes.BAD_REQUEST });
        }
        const data = new Map();

        user.requestsRecord.forEach((record) => {
            const { deviceType, OS_Name } = record;
            const deviceKey = `${deviceType}-${OS_Name}`;
            data.set(deviceKey, { deviceType, OS_Name });
        });

        const arrayData = Array.from(data.values());
        res.status(https_codes.SUCCESS).json({ success: true, data: arrayData });

    } catch (error) {
        console.error("error on gathering devices info ", error);
        next(new Error(`Error from server on gathering devices info: ${error.message}`));
    }
}