const bcryptjs = require("bcryptjs");
const User = require("../models/User");
const {
  registerValidation,
  loginValidation,
} = require("../validations/validation");
const RefreshToken = require("../models/RefreshToken")
const generateAccessToken = require("../validations/generateToken");
const { verifyRefreshToken } = require("../validations/verifyTokens");
const xss = require("xss");

/* Much of the coding for the register and login routes are adapted from
 lab sessions */
/* function that registers user on route below
*  GET- piazza/user/register */
exports.register = async (req, res) => {
  
  const { error } = registerValidation(req.body); // send the body of post to validation function
  if (error) {
    return res.status(400).send({ message: error["details"][0]["message"] }); // send error
  }
  const userExists = await User.findOne({ email: xss(req.body.email) }); // look for user
  if (userExists) {
    // if user exists send error
    return res.status(400).send({ message: "User already exists" });
  }
  const salt = await bcryptjs.genSalt(5); // generate salt
  const hashedPassword = await bcryptjs.hash(xss(req.body.password), salt); // hash password
  // create  new User
  const user = new User({
    username: xss(req.body.username),
    email: xss(req.body.email),
    password: hashedPassword,
  });

  try { // try catch block in case there are errors with saving user
    const savedUser = await user.save(); // save user
    return res.send(savedUser); // send user
  } catch (err) {
    return res.send({ message: err });
  }
};
/* function that logs in user on route below
*  GET- piazza/user/login */
exports.login = async (req, res) => {
  
  const { error } = loginValidation(req.body); // validate login with login validation funciton
  if (error) {
    return res.status(401).send({ message: error["details"][0]["message"] }); // return if there is an error
  }
  const user = await User.findOne({ email: xss(req.body.email) }); // find user
  if (!user) {
    return res.status(401).send({ message: "User does not exists" }); // error if user does not exist
  }
  // compare request password with user.password using bcrypt
  const passwordValidation = await bcryptjs.compare(
    xss(req.body.password),
    user.password
  );
  // if password invalud
  if (!passwordValidation) {
    return res.status(400).send({ message: "password is wrong" });
  }
  const tokens = await generateAccessToken(user._id);
  return res
    .header("authtoken", tokens.accessToken)
    .header("refreshtoken", tokens.refreshToken)
    .send({
      "authtoken": tokens.accessToken,
      "refreshtoken": tokens.refreshToken,
    }); // send header with token and token
};

// function that refreshes token in refresh route
exports.refreshToken = async (req, res, next) => {
  try{
  const tokenToRefresh = req.header("refreshtoken"); // get refresh token from header
  // verify this token and get new one using verifyRefreshToken in validations folder
  const refreshedTokens = await verifyRefreshToken(tokenToRefresh);
  const { error } = refreshedTokens; // if there is an error it should return an error key from function
  if (error) {
    // 401 staus as they are unathourised to refresh token
    return res.status(401).send({ message: error });
  }
  return res.send(refreshedTokens); // send refreshed tokens
  }
  catch(error){
    return res.send({message: error})
  }
};

// function that logsout user on logout route
exports.logout = async (req, res, next) => {
  try {
    // find users refresh token
    const refreshToken = await RefreshToken.findOne({ userId: req.user.id }); 
    // they are logging out so we should delete their refreshed token stored in DB
    if (refreshToken) {
      await RefreshToken.findOneAndDelete({ userId: req.user.id });
    }
    return res.send({ message: "logout successful" }); // send success message
  } catch (error) {
    return res.status(400).send({ error });
  }
};
