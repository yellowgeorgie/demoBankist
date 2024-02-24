module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('failure', 'You need to log in!');
        return res.redirect('/login');
    }
    next();
};
