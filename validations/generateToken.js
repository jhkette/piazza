const jsonwebtoken = require('jsonwebtoken')
const RefreshToken = require("../models/RefreshToken")

/**
 * @function generateAccessToken 
 * this functions generates a new access and refresh token
 * @param String user_id  
 * @return Promise - resolves to tokens
*/
const generateAccessToken = async (user_id) =>  {
    var tokens = {};
    //generating acess token
    tokens.accessToken = jsonwebtoken.sign({id: user_id}, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRE });
    //generating refresh token
    tokens.refreshToken = jsonwebtoken.sign({id: user_id}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '240h' });
     
    const refreshToken = await RefreshToken.findOne({ userId: user_id });
    if (refreshToken) {
        await RefreshToken.findOneAndDelete({userId: user_id })
    }
   
    await new RefreshToken({ userId: user_id, refreshToken: tokens.refreshToken }).save()
    return Promise.resolve(tokens); // we return the result of the resolved promise
};
module.exports = generateAccessToken