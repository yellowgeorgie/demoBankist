const express = require('express');
const router = express.Router();
const { validateLoan, validateTransfer } = require('../middleware/middlewares');
const {
    getHome,
    postTransfer,
    postLoan,
    deleteUser,
} = require('../controllers/transactionController');

router.route('/').get(getHome);
router.route('/transfer').post(validateTransfer, postTransfer);
router.route('/loan').post(validateLoan, postLoan);
router.route('/delete').delete(deleteUser);

module.exports = router;
