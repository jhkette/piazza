const express = require("express");
const commentController = require('../controllers/comment')
const router = express.Router();
const {auth} = require("../validations/verifyTokens");



/**
 * @api comment/:postId 
 * @param topic - the topic to be viewed
 * @return An array of Post objects in JSON
**/
router.post("/:postId", auth, commentController.postComment );

module.exports = router;