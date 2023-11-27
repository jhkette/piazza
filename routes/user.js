const express = require("express");
const router = express.Router();
const authController = require("../controllers/user")
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
 * @api user/refresh - GET
 * refreshes a JSON webtoken
 * for reauthorisation. needs to be authorised user
 * to refresh token
 * @return user object as JSON
**/
router.get("/refresh", auth, authController.refreshToken);


/**
 * @api user/logout - delete
 * delete refresh token
 * @return {message}
**/
router.delete("/logout", auth, authController.logout);

module.exports = router;
