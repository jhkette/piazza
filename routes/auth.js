const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth")
const {auth} = require("../validations/verifyTokens");



/**
 * @api user/register - POST
 * register a user
 * (much of this register function is from lab lectures)
 * @return user object as JSON
**/
router.post("/register", authController.register );

/**
 * @api user/login - POST
 * login a user
 * @return user object as JSON
**/
router.post("/login", authController.login );

/**
 * @api user/refresh - POST
 * refreshes a JSON webtoken
 * for reauthorisation. needs to be authorised user
 * to refresh token
 * @return user object as JSON
**/
router.post("/refresh", auth, authController.refreshToken);



router.get("/logout", auth, authController.logout);

module.exports = router;
