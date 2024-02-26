const Transaction = require('../models/transaction');
const User = require('../models/user');
const catchAsync = require('../utilities/catchAsync');

const timestamper = () => {
    let timestamp = new Date();
    return timestamp.toString().substring(0, 25).trim();
};

module.exports.getHome = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    let userTransaction = await Transaction.findOne({ userId });
    if (!userTransaction) {
        userTransaction = new Transaction({ userId });
        userTransaction.movements.push(500 * 0.988);
        userTransaction.interests.push(500 * 0.012);
        userTransaction.timestamps.push(timestamper());
        await userTransaction.save();
    }
    res.render('home/home', { userTransaction });
});

module.exports.postTransfer = catchAsync(async (req, res, err, next) => {
    const { username, transfer } = req.body;
    const fromTransaction = await Transaction.findOne({
        userId: req.user.id,
    });
    const toUser = await User.findOne({ username });
    const toTransaction = await Transaction.findOne({ userId: toUser.id });
    toTransaction.movements.push(transfer);
    toTransaction.timestamps.push(timestamper());
    fromTransaction.movements.push(transfer * -1);
    fromTransaction.timestamps.push(timestamper());
    await fromTransaction.save();
    await toTransaction.save();
    req.flash(
        'success',
        `You've successfully transferred an amount of ${transfer} to ${username}`
    );
    res.redirect('/home');
});

module.exports.postLoan = catchAsync(async (req, res, err, next) => {
    const userId = req.user.id;
    const { loan } = req.body;
    const transaction = await Transaction.findOne({ userId });
    transaction.movements.push(Number(loan * 0.988));
    transaction.interests.push(Number(loan) * 0.012);
    transaction.timestamps.push(timestamper());
    await transaction.save();
    res.redirect('/home');
});

module.exports.deleteUser = catchAsync(async (req, res, err, next) => {
    const userId = req.user.id;
    req.logout(async function (err) {
        if (err) return next(err);
        await Transaction.findOneAndDelete({ userId: userId });
        await User.findByIdAndDelete(userId);
        req.flash('success', 'You have deleted your account.');
        return res.redirect('/login');
    });
});
