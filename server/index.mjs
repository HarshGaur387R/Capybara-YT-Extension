import express from 'express';
import { connectToDatabase } from './db.mjs';
import authRoute from './routes/auth.mjs';
import userRoute from './routes/user.mjs'
import extensionRoute from './routes/extension.mjs'
import configs from './config/config.mjs';
import session from 'express-session';
import MongoDBStore from 'connect-mongodb-session';
import * as url from 'url';
import cors from 'cors';
import path from 'path';
import { allowOnlyVerifiedUsers } from './middleware/allowOnlyVerifiedUsers.mjs';
import { allowOnlyUnverified } from './middleware/allowOnlyUnverified.mjs';
import { verify_csrf_token, generate_csrf_token } from './middleware/csrfToken.mjs';

const app = express();
const port = 5000;
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

app.use(cors())
app.use(express.json());

await connectToDatabase();

/* ---------- - 🗄️🗄️ Setting Up MongoDB session store 🗄️🗄️- --------- */
const MongoDBStoreSession = MongoDBStore(session);

// Configure MongoDB session store
const store = new MongoDBStoreSession({
    uri: configs.MONGODB_CONNECTION_STRING, // MongoDB connection URI
    collection: "Sessions", // Collection name for storing sessions
});
store.on('error', (error) => { console.error('MongoDB session store error:', error) });
/* ----------- 🗄️🗄️ --------------------------------- 🗄️🗄️ --------- */


// Enable Session for root route -
app.use(session({
    secret: configs.SESSIONS_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 3600 * 1000 }, // Set 'secure: true' if using HTTPS
}));


// Using ejs -
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Using Static folder - 
app.use(express.static(path.join(__dirname, '.', '/static')));

function startServer() {

    app.get('/', allowOnlyUnverified, (req, res) => {  res.render("intro") });
    app.get('/home', allowOnlyVerifiedUsers, (req, res) => {res.render('home') })

    app.get('/login', allowOnlyUnverified, (req, res) => { res.render("login") });
    app.get('/signup', allowOnlyUnverified, (req, res) => { res.render("signup") });

    app.get('/verifyEmail', (req, res)=>{ res.render('signUpEmailVerificationScreen')});
    app.get('/forgetPassword', (req, res)=>{ res.render('forgetPasswordScreen')});

    app.use('/api/v1/auth', authRoute);
    app.use('/api/v1/user', userRoute);
    app.use('/api/v1/extension', extensionRoute);
}

app.listen(port, () => {
    console.log(`server listing at http://localhost:${port}`);
})

startServer();