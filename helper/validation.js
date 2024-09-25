const Joi = require('joi');

const signUpSchema = Joi.object()
    .keys({
        name: Joi.string()
            .min(3)
            .max(40)
            .required(),
        email: Joi.string()
            .min(3)
            .max(50)
            .required(),
        address: Joi.string()
            .required(),
        number: Joi.string()
            .min(10)
            .max(13)
            .required(),
        password: Joi.string()
            .min(3)
            .max(12)
            .required(),
    })

module.exports = {
    signUpSchema
}