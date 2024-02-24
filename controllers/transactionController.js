const Transaction = require('../models/transaction');
const User = require('../models/user');
const catchAsync = require('../utilities/catchAsync');

module.exports.getHome = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    let userTransaction = await Transaction.findOne({ userId });
    if (!userTransaction) {
        const newUserTransaction = new Transaction({ userId });
        newUserTransaction.movements.push(500);
        await newUserTransaction.save();
        userTransaction = newUserTransaction;
    }
    res.render('home/home', { userTransaction });
});

module.exports.postTransfer = catchAsync(async (req, res, err, next) => {
    const { username, transfer } = req.body;
    const fromTransaction = await Transaction.findOne({
        userId: req.user.id,
    });
    const remainBal = fromTransaction.movements.reduce(
        (total, el) => total + el
    );
    if (remainBal < transfer) {
        req.flash(
            'error',
            "You're trying to transfer more than what's in your account"
        );
        return res.redirect('/home');
    }

    const toUser = await User.findOne({ username });
    if (!toUser) {
        req.flash('error', 'Invalid user, try again');
        return res.redirect('/home');
    }

    const toTransaction = await Transaction.findOne({ userId: toUser.id });
    if (req.user.id === toTransaction.userId.toString()) {
        req.flash('error', 'Invalid user, try again');
        return res.redirect('/home');
    }

    toTransaction.movements.push(transfer);
    fromTransaction.movements.push(transfer * -1);
    req.flash(
        'success',
        `You've successfully transferred an amount of ${transfer} to ${username}`
    );

    await fromTransaction.save();
    await toTransaction.save();
    res.redirect('/home');
});

module.exports.postLoan = catchAsync(async (req, res, err, next) => {
    const userId = req.user.id;
    const { loan } = req.body;
    const transaction = await Transaction.findOne({ userId });
    transaction.movements.push(loan);
    await transaction.save();
    res.redirect('/home');
});

module.exports.deleteHome = catchAsync(async (req, res, next) => {
    const { username, password } = req.body;
});
