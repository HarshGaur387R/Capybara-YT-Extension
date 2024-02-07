import https_codes from "../config/http_code.mjs";
import userSchema from '../models/User.mjs'

export async function forgetPassword2(req, res) {
    try {
 
        if (!req.session.email) { return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Error on gathering user data Please login again." } }) }
 
        const password = req.session.newPassword;
        if (!password) return res.status(https_codes.CONFLICT_ERROR).json({ success: false, error: { msg: "Password is not provided" } });
 
        let user = await userSchema.findOne({ email: req.session.email });
        if (!user) return res.status(https_codes.CONFLICT_ERROR).json({ success: false, error: { msg: `User not exist with this email, email: ${req.session.email}` } });
 
        user.password = password;
        await user.save();
 
        req.session.user = user;
 
        delete req.session.newPassword;
        delete req.session.email;
        delete req.session.permissionForFPEVS;

        return res.status(https_codes.SUCCESS).json({ success: true, msg: "Password changed successfully" });

    } catch (error) {
        console.error("ForgetPassword second func() : error on changing user's password: ", error);
        return res.status(https_codes.SERVER_ERROR).json({ success: false, error: { msg: "ChangePassword second func(): Error from server on changing user's password" } });
    }
}