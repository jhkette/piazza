const bcryptjs = require("bcryptjs");

const User = require("../models/User");
const {
  registerValidation,
  loginValidation,
} = require("../validations/validation");
const RefreshToken = require("../models/RefreshToken")
const generateAccessToken = require("../validations/generateToken");
const { verifyRefreshToken } = require("../validations/verifyTokens");

exports.register = async (req, res) => {
  const { error } = registerValidation(req.body); // send the body of post to validation function
  if (error) {
    return res.status(400).send({ message: error["details"][0]["message"] }); // send error
  }
  const userExists = await User.findOne({ email: req.body.email }); // look for user
  if (userExists) {
    // if user exists send error
    return res.status(400).send({ message: "User already exists" });
  }
  const salt = await bcryptjs.genSalt(5); // generate salt
  const hashedPassword = await bcryptjs.hash(req.body.password, salt); // hash password

  const user = new User({
    // create  new User
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save(); // save user
    return res.send(savedUser); // send user
  } catch (err) {
    return res.send({ message: err });
  }
};

exports.login = async (req, res) => {
  const { error } = loginValidation(req.body); // validate login with login validation funciton
  if (error) {
    return res.status(401).send({ message: error["details"][0]["message"] }); // return if there is an error
  }
  const user = await User.findOne({ email: req.body.email }); // find user
  if (!user) {
    return res.status(401).send({ message: "User does not exists" }); // error if user does not exist
  }
  // compare request password with user.password using bcrypt
  const passwordValidation = await bcryptjs.compare(
    req.body.password,
    user.password
  );
  // if password invalud
  if (!passwordValidation) {
    return res.status(400).send({ message: "password is wrong" });
  }
  const tokens = await generateAccessToken(user._id);
  return res
    .header("auth-token", tokens.accessToken)
    .header("refresh-token", tokens.refreshToken)
    .send({
      "auth-token": tokens.accessToken,
      "refresh-token": tokens.refreshToken,
    }); // send header with token and token
};

exports.refreshToken = async (req, res, next) => {
  const tokenToRefresh = req.header("refresh-token"); // get refresh token from header
  // verify this token and get new one using verifyRefreshToken in validations folder
  const refreshedTokens = await verifyRefreshToken(tokenToRefresh);
  const { error } = refreshedTokens; // check for error
  if (error) {
    // 401 staus as they are unathourised to refresh token
    return res.status(401).send({ error });
  }
  return res.send(refreshedTokens); // send refreshed tokens
};

exports.logout = async (req, res, next) => {
  try {
    // find users refresh token
    const refreshToken = await RefreshToken.findOne({ userId: req.user.id }); 
    // they are logging out so we should delete their refreshed token stored in DB
    if (refreshToken) {
      await RefreshToken.findOneAndDelete({ userId: req.user.id });
    }
    return res.send({ message: "logout succesful" }); // send success message
  } catch (error) {
    return res.status(400).send({ error });
  }
};
