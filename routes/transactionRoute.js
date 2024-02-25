const express = require('express');
const router = express.Router();

const {
    validateJoiLoan,
    validateJoiTransfer,
    validateUserTransfer,
    validateBalTransfer,
} = require('../middleware/middlewares');

const {
    getHome,
    postTransfer,
    postLoan,
    deleteUser,
} = require('../controllers/transactionController');

router.route('/').get(getHome);

router
    .route('/transfer')
    .post(
        validateJoiTransfer,
        validateUserTransfer,
        validateBalTransfer,
        postTransfer
    );
router.route('/loan').post(validateJoiLoan, postLoan);

router.route('/delete').delete(deleteUser);

module.exports = router;
