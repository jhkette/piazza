const express = require("express");
const router = express.Router();
const auth = require("../validations/verifyToken");
const voteController = require("../controllers/vote")


/**
 * @api vote/:postId/like 
 * This route allows the user to like a post - this 'like 
 * is also stored on the post document
 * @param postId - the unique id of the post to be liked.
 * @return Post object and the Like object as JSON
**/
router.post("/:postId/like", auth, voteController.addLike );

/**
 * @api vote/:postId/dislike -POST 
 * This route allows the user to dislike a post - this 'dislike 
 * is also stored on the post document
 * @param postId - the unique id of the post to be disliked.
 * @return Post object and the dislike object as JSON
**/
  router.post("/:postId/dislike", auth, voteController.addDisLike);

  module.exports = router;