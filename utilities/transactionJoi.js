const Joi = require('joi');

const loanJoiSchema = Joi.object({
    loan: Joi.number().required().min(1),
});

const transactionJoiSchema = Joi.object({
    username: Joi.string().required(),
    transfer: Joi.number().min(1).required(),
});

module.exports = { loanJoiSchema, transactionJoiSchema };
