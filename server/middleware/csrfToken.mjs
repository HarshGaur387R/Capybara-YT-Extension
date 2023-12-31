import https_codes from "../config/http_code.mjs";
import crypto from 'crypto';

export function generate_csrf_token(req, res, next) {
    console.log('inside csrf token generator');

    if (!req.session) {
        console.log('session not found.');
        return res.status(https_codes.SERVER_ERROR).json({ success: false, error: { msg: "Please login again." } });
    }
    const token = crypto.randomBytes(16).toString('hex');

    // Storing token on the server session
    req.session.csrfToken = token;

    // Store the generated token in somewhere client
    res.setHeader('xsrf-auth', token)
    next();
}

export function verify_csrf_token(req, res, next) {
    const token = req.session.csrfToken || undefined;
    const csrfFromRequest = req.headers['xsrf-auth'] || undefined;  // Make sure you are sending this header through client

    if (!csrfFromRequest && !token) {
        console.log('Token Not Provided: ', csrfFromRequest, token);

        res.removeHeader('xsrf-auth');
        res.clearCookie('entryToken');
        req.session.destroy();

        return res.status(403).json({ success: false, error: { msg: "Please login again. its a possible attempt of csrf" } });
    }

    if (csrfFromRequest !== token) {
        console.log('Token Not Matched: ', csrfFromRequest, token); 

        res.removeHeader('xsrf-auth');
        res.clearCookie('entryToken');
        req.session.destroy();

        return res.status(403).json({ success: false, error: { msg: "Please login again. its a possible attempt of csrf" } });
    }

    next();
}