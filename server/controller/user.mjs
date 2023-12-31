import https_codes from '../config/http_code.mjs';
import bcrypt from 'bcrypt';
import configs from '../config/config.mjs';

export async function myData(req, res) {
    try {
        const user = req.session.user;
        return res.status(https_codes.SUCCESS).json({ success: true, data: user });

    } catch (error) {
        console.error('error on creating myData', error);
        return res.status(https_codes.SERVER_ERROR).json({ success: false, error: "error from server" });
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