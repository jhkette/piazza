const jsonwebtoken = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");


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
// https://dev.to/cyberwolves/jwt-authentication-with-access-tokens-refresh-tokens-in-node-js-5aa9

const verifyRefreshToken = async (refreshToken) => {
  const privateKey = process.env.REFRESH_TOKEN_SECRET;
  return new Promise(async (resolve, reject) => {
    await RefreshToken.findOne({ refreshToken: refreshToken });
    if (!refreshToken) {
      return reject({ error: true, message: "Invalid refresh token" });
    }
    jwt.verify(refreshToken, privateKey, (err, tokenDetails) => {
      if (err) {
        return reject({ error: true, message: "Invalid refresh token" });
      }
      resolve({
        tokenDetails,
        error: false,
        message: "Valid refresh token",
      });
    });
  });
};

module.exports = {auth, verifyRefreshToken};
