const Joi = require('joi');

const signUpSchemaLogin = Joi.object()
    .keys({
        email: Joi.string()
            .min(3)
            .max(50)
            .required(),
        password: Joi.string()
            .min(3)
            .max(19)
            .required(),
    })

module.exports = {
    signUpSchemaLogin
}