const catchAsync = require('../utilities/catchAsync');

module.exports.getRegister = (req, res) => {
    res.render('users/register');
};

module.exports.postRegister = catchAsync(async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const newUser = new User({ username });
        const registerUser = await User.register(newUser, password);
        res.redirect('/login');
    } catch (err) {
        req.flash('error', `${err.message}`);
        res.redirect('/register');
    }
});

module.exports.getLogin = (req, res, next) => {
    res.render('users/login');
};

module.exports.postLogin = catchAsync(async (req, res) => {
    req.flash('success', 'Welcome, back!');
    res.redirect('/home');
});

module.exports.getLogout = catchAsync(async (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err);
        req.flash('success', "You've been logged out");
        return res.redirect('/login');
    });
});
