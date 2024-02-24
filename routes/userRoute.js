const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
    getRegister,
    postRegister,
    getLogin,
    postLogin,
    getLogout,
} = require('../controllers/userController');

router.route('/register').get(getRegister).post(postRegister);

router
    .route('/login')
    .get(getLogin)
    .post(
        passport.authenticate('local', {
            failureFlash: true,
            failureRedirect: '/login',
        }),
        postLogin
    );

router.route('/logout').get(getLogout);

module.exports = router;
