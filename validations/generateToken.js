
const jsonwebtoken = require('jsonwebtoken')
const RefreshToken = require("../models/RefreshToken")


const generateAccessToken = async (user_id) =>  {
    
    var tokens = {};
    //generating acess token
    tokens.accessToken = jsonwebtoken.sign({id: user_id}, process.env.TOKEN_SECRET, { expiresIn: '1h' });
    //generating refresh token
    tokens.refreshToken = jsonwebtoken.sign({id: user_id}, process.env.AUTH_TOKEN_SECRET, { expiresIn: '72h' });
     
    const refreshToken = await RefreshToken.findOne({ userId: user_id });
    if (refreshToken) {
        await RefreshToken.findOneAndDelete({userId: user_id })
    }
   
    await new RefreshToken({ userId: user_id, refreshToken: tokens.refreshToken }).save()
    return Promise.resolve(tokens);
};

module.exports = generateAccessToken