const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/middlewares');
const {
    getHome,
    postTransfer,
    postLoan,
    deleteUser,
} = require('../controllers/transactionController');

router.route('/').get(getHome);
router.route('/transfer').post(postTransfer);
router.route('/loan').post(postLoan);
router.route('/delete').delete(deleteUser);

module.exports = router;
