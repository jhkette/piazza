const express = require("express");

const router = express.Router();
const bcryptjs = require("bcryptjs");

const User = require("../models/User");
const {
  registerValidation,
  loginValidation,
} = require("../validations/validation");
const jsonwebtoken = require("jsonwebtoken");

/* Much of the coding for these route are taken and adapted from
 */

router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send({ message: error["details"][0]["message"] });
  }

  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    return res.status(400).send({ message: "User already exists" });
  }
  const salt = await bcryptjs.genSalt(5);
  const hashedPassword = await bcryptjs.hash(req.body.password, salt);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();

    return res.send(savedUser);
  } catch (err) {
    return res.send({ message: err });
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send({ message: error["details"][0]["message"] });
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send({ message: "User does not exists" });
  }

  const passwordValidation = await bcryptjs.compare(
    req.body.password,
    user.password
  );
  if (!passwordValidation) {
    return res.status(400).send({ message: "password is wrong" });
  }
  const token = jsonwebtoken.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  return res.header("auth-token", token).send({ "auth-token": token });
});

module.exports = router;
