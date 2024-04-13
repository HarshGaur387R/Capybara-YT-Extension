// import dotenv from 'dotenv'; // Import the config function from dotenv
// dotenv.config({path:'config/.env'});

import express from 'express';
import { connectToDatabase } from './db.mjs';
import authRoute from './routes/auth.mjs';
import userRoute from './routes/user.mjs'
import extensionRoute from './routes/extension.mjs'
// import configs from './config/config.mjs';
import session from 'express-session';
import MongoDBStore from 'connect-mongodb-session';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import * as url from 'url';
import cors from 'cors';
import path from 'path';
import { allowOnlyVerifiedUsers } from './middleware/allowOnlyVerifiedUsers.mjs';
import { allowOnlyUnverified } from './middleware/allowOnlyUnverified.mjs';
import { verify_csrf_token, generate_csrf_token } from './middleware/csrfToken.mjs';
import { checkPermission } from './middleware/checkPermissions.mjs';
import expressDevice from 'express-device';
import handleError from './middleware/errorHandling.mjs';
import helmet from 'helmet';
import { randomBytes } from 'crypto';
import rateLimiter from './middleware/rateLimiter.mjs';


const nonce = randomBytes(16).toString('base64');

const app = express();
const port = process.env.PORT;
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

app.use(cors({
    origin: ['*.vercel.app', 'chrome-extension://*']
}));

app.use(express.json({ limit: '20kb' }));
app.use(expressDevice.capture());

app.use(helmet())
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'", '*.vercel.app', 'chrome-extension://*'],
            connectSrc: ["'self'", '*.vercel.app', 'chrome-extension://*'],
            scriptSrc: ["'self'", 'trusted-cdn.com', 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js', `'nonce-${nonce}'`],
            styleSrc: ["'self'", 'fonts.googleapis.com', 'cdn.jsdelivr.net', `'nonce-${nonce}'`],
            // Add more directives as needed
        },
    })
);
app.use(helmet.noSniff()); // Prevent browsers from MIME sniffing
app.use(helmet.xssFilter()); // Adds the X-XSS-Protection header


await connectToDatabase();

/* ---------- - 🗄️🗄️ Setting Up MongoDB session store 🗄️🗄️- --------- */
const MongoDBStoreSession = MongoDBStore(session);

// Configure MongoDB session store
const store = new MongoDBStoreSession({
    uri: `${process.env.MONGODB_CONNECTION_STRING}/${process.env.DATABASE_NAME}`, // MongoDB connection URI
    collection: "Sessions", // Collection name for storing sessions
});
store.on('error', (error) => { console.error('MongoDB session store error:', error) });
/* ----------- 🗄️🗄️ --------------------------------- 🗄️🗄️ --------- */

// Enable Session for root route -
app.use(session({
    secret: process.env.SESSIONS_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { secure: false, httpOnly: true, sameSite: 'strict', maxAge: 24 * 3600 * 1000 },
    // For production cookie: { secure: true, httpOnly: true, sameSite: 'strict', maxAge: 24 * 3600 * 1000 },
    rolling: true
}));
app.use(ExpressMongoSanitize());


// Using ejs -
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Using Static folder - 
app.use(express.static(path.join(__dirname, '.', '/static')));

function startServer() {
    const clearSessionPermissions = (req, res, next) => {
        delete req.session.permissionForFPEVS;
        delete req.session.permissionForEVS;
        next();
    };

    // Routes -
    app.get('/', allowOnlyUnverified, clearSessionPermissions, (req, res) => {
        res.render("intro", { nonce: nonce });
    });

    app.get('/about', clearSessionPermissions, (req, res) => {
        res.render('about', { nonce: nonce });
    });

    app.get('/privacy-policy', clearSessionPermissions, (req, res) => {
        res.render('privacy-policy', { nonce: nonce });
    });

    app.get('/home', allowOnlyVerifiedUsers, clearSessionPermissions, (req, res) => {
        res.render('home', { nonce: nonce });
    });

    app.get('/profile', allowOnlyVerifiedUsers, clearSessionPermissions, (req, res) => {
        res.render('profile', { nonce: nonce });
    });

    app.get('/changeEmail', allowOnlyVerifiedUsers, clearSessionPermissions, (req, res) => {
        res.render('changeEmailForUser', { nonce: nonce });
    })

    app.get('/changePassword', allowOnlyVerifiedUsers, clearSessionPermissions, (req, res) => {
        res.render('changePasswordForUser', { nonce: nonce });
    })

    app.get('/dashboard', allowOnlyVerifiedUsers, clearSessionPermissions, (req, res) => {
        res.render('dashboard', { nonce: nonce });
    });

    app.get('/contact', allowOnlyVerifiedUsers, clearSessionPermissions, (req, res) => {
        res.render('contact', { nonce: nonce });
    });

    app.get('/login', allowOnlyUnverified, (req, res) => {
        res.render("login", { nonce: nonce });
    });

    app.get('/signup', allowOnlyUnverified, (req, res) => {
        res.render("signup", { nonce: nonce });
    });

    app.get('/verifyEmail', checkPermission('permissionForEVS'), (req, res) => {
        res.render('signUpEmailVerificationScreen', { nonce: nonce });
    });

    app.get('/forgetPassword', allowOnlyUnverified, (req, res) => {
        res.render('forgetPasswordScreen', { nonce: nonce });
    });

    app.get('/verifyEmailToForgetPassword', checkPermission('permissionForFPEVS'), (req, res) => {
        res.render('forgetPasswordVerifyEmail', { nonce: nonce });
    });


    // Apis -
    app.use('/api/v1/auth', authRoute);
    app.use('/api/v1/user', userRoute);
    app.use('/api/v1/extension', rateLimiter(5, 5000, "Wait few seconds before sending new requests"), extensionRoute);

    // error handling middleware
    app.use(handleError);
}

app.listen(port, () => {
    console.log(`server listing at ${process.env.WEB_URL}${port}`);
});

startServer();