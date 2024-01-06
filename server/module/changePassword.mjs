import https_codes from "../config/http_code.mjs";
import userSchema from '../models/User.mjs'


export async function changePassword2(req, res) {
    try {
        const password = req.session.newPassword;
        if (!password) return res.status(https_codes.CONFLICT_ERROR).json({ success: false, error: { msg: "Password is not provided" } });

        let user = await userSchema.findOne({ email: req.session.user.email });
        if (!user) return res.status(https_codes.CONFLICT_ERROR).json({ success: false, error: { msg: "User not found." } });

        user.password = password;
        await user.save();

        req.session.user = user;

        delete req.session.newPassword;
        return res.status(https_codes.SUCCESS).json({ success: true, meg: "User's password updated successfully" });

    } catch (error) {
        console.error("ChangePassword second func() : error on changing user's password: ", error);
        return res.status(https_codes.SERVER_ERROR).json({ success: false, error: { msg: "ChangePassword second func(): Error from server on changing user's password" } });
    }
}
