import jsonwebtoken from "jsonwebtoken";
import nodemailer from "nodemailer"
import configs from "../config/config.mjs";
import https_codes from "../config/http_code.mjs";
import userSchema from '../models/User.mjs';


const jwt = jsonwebtoken;

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: configs.SERVICE_EMAIL,
		pass: configs.SERVICE_EMAIL_PASSWORD
	}
});


export async function sendEmailVerificationCode(email, verificationCode) {
	const mailOptions = {
		from: configs.SERVICE_EMAIL,
		to: email,
		subject: 'Email Verification',
		html: `<!DOCTYPE html>
        <html>
        <head>
            <title>Verification Code</title>
        </head>
        <body>
            <h2>Hello,</h2>
            <p>Thank you for signing up with us. Please verify your email address using the code below:</p>
            <h3 style="color:blue;">Your Verification Code: ${verificationCode}</h3>
            <p>Please enter this code on the verification page. If you did not request this code, please ignore this email.</p>
            <p>Best,</p>
            <p>Your Team</p>
        </body>
        </html>`
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}

export async function verifyEmailVerificationCode(req, res) {

	try {

		if (!req.session) { return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Error on gathering user data Please signup again." } }) }
		if (!req.session.user) { return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Error on gathering user data Please signup again." } }) }

		const verificationCode = req.session.verificationCode;
		const userDataToRegister = req.session.user;

		// IF
		if (!req.body.verificationCode) { return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "verification code isn't provided." } }) }
		if (typeof req.body.verificationCode !== 'string' && typeof verificationCode !== 'string') return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Incorrect verification code format" } });
		if (req.body.verificationCode.length !== 6 && verificationCode.length !== 6) return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Unauthorized verification code." } });
		if (req.body.verificationCode !== verificationCode) { return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Incorrect verification code." } }) };

		// ELSE
		await userSchema.create(userDataToRegister).then(async (user) => {
			user.isEmailVerified = true;
			await user.save();
			req.session.user = user;
			return res.status(https_codes.SUCCESS).json({ success: true, msg: "Signed-up successfully" });
		}).catch((error) => {
			if (error.code === 11000 || error.code === 11001) {
				console.error('Duplicate email');
				return res.status(https_codes.CONFLICT_ERROR).json({ success: false, error: "Email address is already taken" });
			}
			else {
				console.error('error on signing-up user: ', error);
				return res.status(https_codes.SERVER_ERROR).json({ success: false, error: "Error from server on creating account" });
			}
		});


	} catch (error) {
		console.error('error on signing-up user: ', error);
		return res.status(https_codes.SERVER_ERROR).json({ success: false, error: "Error from server on signup" });
	}
}