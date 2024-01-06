import https_codes from "../config/http_code.mjs";
import userSchema from '../models/User.mjs';

export async function createUser(req, res) {
    try {

        if (!req.session.user) { return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Error on gathering user data Please signup again." } }) }
        const userDataToRegister = req.session.user;

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