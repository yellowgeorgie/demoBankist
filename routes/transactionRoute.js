const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/middlewares');
const {
    getHome,
    postTransfer,
    postLoan,
    deleteHome,
} = require('../controllers/transactionController');

router.route('/').get(getHome);
router.route('/transfer').post(postTransfer);
router.route('/loan').post(postLoan);
router.route('/delete').post(deleteHome);

module.exports = router;
