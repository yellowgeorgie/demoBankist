const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const transactionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    currency: {
        type: String,
        enum: ['usd', 'eu'],
        default: 'usd',
    },
    movements: [
        {
            type: Number,
            required: true,
        },
    ],
    timestamps: [{ type: String }],
});

const Transaction = model('Transaction', transactionSchema);

module.exports = Transaction;
