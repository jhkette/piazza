const express = require("express");
const router = express.Router();
const auth = require("../validations/verifyToken");
const authController = require("../controllers/auth")

/* Much of the coding for the register and logins routes are adapted from
 lab sessions */

/**
 * @api auth/register - POST
 * register a user
 * (much of this register function is from lab lectures)
 * @return user object as JSON
**/
router.post("/register", auth, authController.register );

/**
 * @api auth/login - POST
 * register a user
 * (much of this register function is from lab lectures)
 * @return user object as JSON
**/
router.post("/login", auth, authController.login );

module.exports = router;
