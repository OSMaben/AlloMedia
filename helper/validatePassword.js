const Joi = require('joi');

const validatePassword = Joi.object()
    .keys({
        password: Joi.string()
            .min(3)
            .max(12)
            .required(),
    })

module.exports = {
    validatePassword
}