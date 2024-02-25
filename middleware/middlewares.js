const {
    transactionJoiSchema,
    loanJoiSchema,
} = require('../utilities/transactionJoi');
const appError = require('../utilities/appError');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('failure', 'You need to log in!');
        return res.redirect('/login');
    }
    next();
};

module.exports.validateLoan = (req, res, next) => {
    const { error } = loanJoiSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join('');
        throw new appError(500, msg);
    } else {
        next();
    }
};

module.exports.validateTransfer = (req, res, next) => {
    const { error } = transactionJoiSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join('');
        throw new appError(500, msg);
    } else {
        next();
    }
};
