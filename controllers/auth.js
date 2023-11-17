const bcryptjs = require("bcryptjs");
const User = require("../models/User");
const {
  registerValidation,
  loginValidation,
} = require("../validations/validation");
const jsonwebtoken = require("jsonwebtoken");



exports.register = async (req, res) => {
    const { error } = registerValidation(req.body); // send the body of post to validation function
    if (error) {
      return res.status(400).send({ message: error["details"][0]["message"] }); // send error
    }
    const userExists = await User.findOne({ email: req.body.email }); // look for user
    if (userExists) { // if user exists send error
      return res.status(400).send({ message: "User already exists" });
    }
    const salt = await bcryptjs.genSalt(5); // generate salt
    const hashedPassword = await bcryptjs.hash(req.body.password, salt);
  
    const user = new User({ // create  new User
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
}


exports.login = async (req, res) => {
    const { error } = loginValidation(req.body); // validate login with login validation funciton
    if (error) {
      return res.status(400).send({ message: error["details"][0]["message"] }); // return if there is an error
    }
    const user = await User.findOne({ email: req.body.email }); // find user
    if (!user) {
      return res.status(400).send({ message: "User does not exists" }); // error if user does not exist
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
    const token = jsonwebtoken.sign({ _id: user._id }, process.env.TOKEN_SECRET); // sign json webtoken
    return res.header("auth-token", token).send({ "auth-token": token }); // send header with token and token
  }