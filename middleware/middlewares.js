const {
    transactionJoiSchema,
    loanJoiSchema,
} = require('../utilities/transactionJoi');
const appError = require('../utilities/appError');
const User = require('../models/user');
const Transaction = require('../models/transaction');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('failure', 'You need to log in!');
        return res.redirect('/login');
    }
    next();
};

module.exports.validateJoiLoan = (req, res, next) => {
    const { error } = loanJoiSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join('');
        throw new appError(500, msg);
    } else {
        next();
    }
};

module.exports.validateJoiTransfer = (req, res, next) => {
    const { error } = transactionJoiSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join('');
        throw new appError(500, msg);
    } else {
        next();
    }
};

module.exports.validateUserTransfer = async (req, res, next) => {
    const { username } = req.body;
    const toUser = await User.findOne({ username });
    if (!toUser || req.user.id === toUser.id.toString()) {
        req.flash('error', 'User does not exist / is invalid');
        return res.redirect('/home');
    }
    next();
};

module.exports.validateBalTransfer = async (req, res, next) => {
    const { transfer } = req.body;
    const userTransaction = await Transaction.findOne({ userId: req.user.id });
    const balance = userTransaction.movements.reduce((total, el) => total + el);
    if (balance < transfer) {
        req.flash(
            'error',
            "You're transferring more than your remaining balance."
        );
        return res.redirect('/home');
    }
    next();
};
