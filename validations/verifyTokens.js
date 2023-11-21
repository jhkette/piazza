const jsonwebtoken = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");
const generateAccessToken = require("./generateToken");

/**
 * @function auth
 * the function authorises a new user
 * @params req, res,next
 * @return void
*/
function auth(req, res, next) {
  const token = req.header("authtoken");
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
/**
 * @function verifyRefreshToken 
 * the function generates new tokens
 * @param String refresh - the refesh token string
 * @return token - a new JWT token
*/
const verifyRefreshToken = async (refresh) => {
  const privateKey = process.env.REFRESH_TOKEN_SECRET;
  const refreshToken = await RefreshToken.findOne({ refreshToken: refresh }); // find related refeshtoken in db
  if (!refreshToken) { // return error if not there
    return { error: "access denied - invalid refresh token" };
  }
  try {
    const authtoken = jsonwebtoken.verify(refresh, privateKey); // verify refresh token
    const { id } = authtoken; // destructure id
    const newToken = generateAccessToken(id); // get new token
    return newToken;
  } catch (error) {
    return { error };
  }
};

module.exports = { auth, verifyRefreshToken };
