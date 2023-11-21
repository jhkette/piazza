const joi = require('joi')
const passwordComplexity = require("joi-password-complexity");

/**
 * Both these validation functions come from 
 * lab lessons
 * */

const registerValidation = (data) => {
    const complexityOptions = { // here are the password complexity options
        min: 6,
        max: 50,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
    };
    const schemaValidation = joi.object({  // validate registration attempt usig joi
        username: joi.string().required().min(3).max(256),
        email: joi.string().required().min(6).max(256).email(),
        password: passwordComplexity(complexityOptions) // i added some password complexity defaults
    })
    return schemaValidation.validate(data) 
}

const loginValidation = (data) => {
    const schemaValidation = joi.object({ // validate login attempt usig joi
        email: joi.string().required().min(6).max(256).email(),
        password: joi.string().required().min(6).max(1024)
    })
    return schemaValidation.validate(data)

}

module.exports = {registerValidation, loginValidation};