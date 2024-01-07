import jsonwebtoken from "jsonwebtoken";
import nodemailer from "nodemailer"
import configs from "../config/config.mjs";
import https_codes from "../config/http_code.mjs";

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
		console.error(error);
		return false;
	}
}


export async function verifyEmailVerificationCode(callback) {

	return async (req, res) => {

		try {
			if (!req.session) { return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Error on gathering user data Please signup again." } }) }
			if (!req.session.token) { return res.status(https_codes.SERVER_ERROR).json({ success: false, error: { msg: "Error on verifying. PLease try again." } }) }
			if (!req.body.verificationCode) { return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "verification code isn't provided." } }) };

			const token = req.session.token;
			const verificationCode = req.body.verificationCode;

			if (typeof verificationCode !== 'string') return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Incorrect verification code format." } });
			if (verificationCode.length !== 6) return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Unauthorized verification code." } });

			try {
				const decoded = jwt.verify(token, verificationCode);
				if (decoded.msg !== 'done') return res.status(https_codes.SERVER_ERROR).json({ success: false, error: { msg: "Error on verification. Please try again." } });
			} catch (err) {
				console.error("error from verifyEmailVerificationCode() : ", err);
				if (err.name === 'TokenExpiredError') return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Verification code expired. Please try again." } });

				return res.status(https_codes.SERVER_ERROR).json({ success: false, error: { msg: "Error on matching verification code. Please try again." } });
			}

			delete req.session.token;
			return await callback(req, res);

		} catch (error) {
			console.error('error on verifying user: ', error);
			return res.status(https_codes.SERVER_ERROR).json({ success: false, error: "Error from server on verifying Email" });
		}
	}
}