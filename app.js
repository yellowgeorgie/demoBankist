'use strict';

// 1. Setting up the requirements

const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

// 2. Setting up the configurations

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(flash());

const sessionConfig = {
    secret: 'thisisaterriblesecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 5,
    },
};

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// 3. Establishing a connection to the database (nonSQL) mongoDB

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/bankist');
}

main()
    .then(() => console.log('Database connected!'))
    .catch(err => console.log(`Database connection failed - ${err}`));

// 4. Middleware (for import from a different file)

// 5. Setting up error handlers (import from a different file)

class appError extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

const catchAsync = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(err => next(err));
    };
};

// 6. Setting up the routes

app.use((req, res, next) => {
    next();
});

app.get('/home', (req, res, next) => res.render('home/home'));

app.get('/register', (req, res) => {
    res.render('users/register');
});

app.post(
    '/register',
    catchAsync(async (req, res, next) => {
        const { username, password } = req.body;
        const newUser = new User({ username });
        const registerUser = await User.register(newUser, password);
        req.login(registerUser, function (err) {
            if (err) return next(err);
            res.redirect('/home');
        });
    })
);

app.get('/login', (req, res, err, next) => {
    res.render('users/login');
});

app.post(
    '/login',
    passport.authenticate(
        'local',
        { failureFlash: true, failureRedirect: '/login' },
        (req, res, next) => {
            req.flash('success', 'Welcome, back!');
            res.redirect('/home');
        }
    )
);

// 6.1 Error routes

app.all('*', (req, res, next) => {
    next(new appError(404, 'Page could not be found.'));
});

app.use((err, req, res, next) => {
    err.statusCode ||= 500;
    err.message ||= `Something's messed up!`;
    res.status(err.statusCode).send(err.message);
});

// 7. Starting up the app to listen

app.listen(port, () => console.log(`Now listening on port ${port}`));
