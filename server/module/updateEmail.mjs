import https_codes from "../config/http_code.mjs";
import userSchema from '../models/User.mjs'

export async function updateEmail2(req, res) {
    try {
        const newEmail = req.session.newEmail;
        if (!newEmail) return res.status(https_codes.CONFLICT_ERROR).json({ success: false, error: { msg: "New Email is not provided" } });

        let user = await userSchema.findOne({ email: newEmail });
        if (user) return res.status(https_codes.CONFLICT_ERROR).json({ success: false, error: { msg: "Email is already taken" } });

        const oldEmail = req.session.user.email;
        user = await userSchema.findOne({ email: oldEmail });
        if (!user) return res.status(https_codes.CONFLICT_ERROR).json({ success: false, error: { msg: "User not found" } });
        
        user.email = newEmail;
        await user.save();

        req.session.user = user;

        delete req.session.newEmail;
        return res.status(https_codes.SUCCESS).json({ success: true, meg: "User's email updated successfully" });

    } catch (error) {
        console.error("error on updating email:", error);
        return res.status(https_codes.SERVER_ERROR).json({ success: false, error: { msg: "Error on updating email" } });
    }
}
