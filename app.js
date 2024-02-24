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
const Transaction = require('./models/transaction');
const userRoute = require('./routes/userRoute');
const transactionRoute = require('./routes/transactionRoute');
const { isLoggedIn } = require('./middleware/middlewares');

// 2. Setting up the configurations

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

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
app.use(flash());

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

// 6. Setting up the routes

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// 6.1 Home route

// app.get(
//     '/home',
//     isLoggedIn,
//     catchAsync(async (req, res, next) => {
//         const userId = req.user.id;
//         let userTransaction = await Transaction.findOne({ userId });
//         if (!userTransaction) {
//             const newUserTransaction = new Transaction({ userId });
//             newUserTransaction.movements.push(500);
//             await newUserTransaction.save();
//             userTransaction = newUserTransaction;
//         }
//         res.render('home/home', { userTransaction });
//     })
// );

// app.post(
//     '/home/transfer',
//     isLoggedIn,
//     catchAsync(async (req, res, err, next) => {
//         const { username, transfer } = req.body;
//         const fromTransaction = await Transaction.findOne({
//             userId: req.user.id,
//         });
//         const toUser = await User.findOne({ username });
//         const toTransaction = await Transaction.findOne({ userId: toUser.id });
//         if (!toUser || req.user.id === toTransaction.userId.toString()) {
//             req.flash('error', 'Invalid user, try again');
//             return res.redirect('/home');
//         }
//         toTransaction.movements.push(transfer);
//         fromTransaction.movements.push(transfer * -1);
//         req.flash(
//             'success',
//             `You've successfully transferred an amount of ${transfer} to ${username}`
//         );
//         await fromTransaction.save();
//         await toTransaction.save();
//         res.redirect('/home');
//     })
// );

// app.post(
//     '/home/loan',
//     isLoggedIn,
//     catchAsync(async (req, res, err, next) => {
//         const userId = req.user.id;
//         const { loan } = req.body;
//         const transaction = await Transaction.findOne({ userId });
//         transaction.movements.push(loan);
//         await transaction.save();
//         res.redirect('/home');
//     })
// );

// app.delete('/home/delete', isLoggedIn, (req, res, next) => {
//     const { username, password } = req.body;
// });

// 6.2 Setting up the user routes

app.use('/home', isLoggedIn, transactionRoute);
app.use('/', userRoute);

// 6.3 Error routes

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
