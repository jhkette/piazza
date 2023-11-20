const jsonwebtoken = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");
const generateAccessToken  = require("./generateToken")


function auth(req, res, next) {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send({ message: "Access denied" });
  }
  try {
    const verified = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;

    next(); // call next as there is no return
  } catch (err) {
    // 403 status as they have token but no longer valid
    return res.status(403).send({ message: "Invalid token" });
  }
}


const verifyRefreshToken = async (refresh) => {
  const privateKey = process.env.REFRESH_TOKEN_SECRET;
  const refreshToken= await RefreshToken.findOne({ refreshToken: refresh });
  if (!refreshToken) {
     return {error: "access denied - invalid refresh token"}
  }
  try{
    const authtoken =  jsonwebtoken.verify(refresh, privateKey)
    const {id} = authtoken
    const newToken = generateAccessToken(id)
    return newToken
  }
  catch (error) {
    return  { error: error };
  }
 
}


module.exports = {auth, verifyRefreshToken};
