import configs from "../config/config.mjs";
import https_codes from "../config/http_code.mjs";
import jsonwebtoken from 'jsonwebtoken';

const jwt = jsonwebtoken;
export async function tokenAuthenticator(req, res, next) {

    try {
        let token = req.headers['authorization']; 
        if (!token) return res.status(https_codes.BAD_REQUEST).json({ error: "AuthToken isn't provided." });
        
        token = token.split(' ')[1];

        const id = jwt.decode(token, configs.JWT_SECRET);
        
        if (!id || !id.user_id) return res.status(https_codes.BAD_REQUEST).json({ error: "Incorrect token is provided" });

        next()
    } catch (error) {
        console.error('error in token Authenticator: ', error);
        return res.status(https_codes.SERVER_ERROR).json({ error: "Error from server on checking token" });
    }
}