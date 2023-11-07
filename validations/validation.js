const joi = require('joi')
const passwordComplexity = require("joi-password-complexity");

const registerValidation = (data) => {
    const complexityOptions = {
        min: 6,
        max: 50,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
    };
    const schemaValidation = joi.object({
        username: joi.string().required().min(3).max(256),
        email: joi.string().required().min(6).max(256).email(),
        password: passwordComplexity(complexityOptions)
    })
    return schemaValidation.validate(data)
}

const loginValidation = (data) => {
    const schemaValidation = joi.object({
        email: joi.string().required().min(6).max(256).email(),
        password: joi.string().required().min(6).max(1024)
    })
    return schemaValidation.validate(data)

}

module.exports = {registerValidation, loginValidation};