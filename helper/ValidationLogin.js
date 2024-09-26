const Joi = require('joi');

const signUpSchemaLogin = Joi.object()
    .keys({
        email: Joi.string()
            .min(3)
            .max(50)
            .required(),
        password: Joi.string()
            .min(3)
            .max(12)
            .required(),
    })

module.exports = {
    signUpSchemaLogin
}