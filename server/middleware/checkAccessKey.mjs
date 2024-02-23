import https_codes from "../config/http_code.mjs";
import userSchema from '../models/User.mjs'
import configs from "../config/config.mjs";
import jsonwebtoken from 'jsonwebtoken';

const jwt = jsonwebtoken;

export async function checkAccessKey(req, res, next) {

    try {
       if(!req.body && !req.body.accessKey && typeof req.body.accessKey !== 'accessKey'){
        return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "accessKey is not provided" } });
       }

       const accessKey = req.body.accessKey;
       const id = jwt.verify(accessKey,configs.ACCESS_KEY_SECRET)._id;

       if (!id) return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Incorrect token is provided" } });

       const user = await userSchema.findById(id);
       if (!user) { return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Invalid accessKey. No user authorized with this key" } }) };

       if (user.accessKey !== accessKey) return res.status(https_codes.BAD_REQUEST).json({ success: false, error: { msg: "Invalid accessKey. This key is not authorized to any user" } });

       req.session.user_id = id;
        next();

    } catch (error) {
        console.error('error on verifying accessToken: ', error);
        return res.status(https_codes.SERVER_ERROR).json({ success: false, error: "Error from server on verifying AccessToken" });
    }
}