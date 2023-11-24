const express = require("express");
const router = express.Router();
const {auth} = require("../validations/verifyTokens");
const postController = require("../controllers/post");
const voteController = require("../controllers/postvote");
const commentController = require("../controllers/postcomments")



/**
 * @api GET posts/topic/:topic  
 * This route sends a collection of posts that are associated with a topic
 * these are ordered -descending - by vote score
 * @param topic - the topic to be viewed
 * @return An array of Post objects assigned to topic
**/
router.get("/topic/:topic", auth, postController.getTopic);

/**
 * @api GET posts/topic/:topic/expired  
 * This route sends a collection of posts that are associated with a topic
 * that are also expired posts
 * @param topic - the topic to be viewed
 * @return An array of Post objects assigned to topic
**/
router.get("/topic/:topic/expired", auth, postController.getExpiredPosts);


/**
 * @api POST posts/comment/:postId 
 * @param postid - the post with the commments
 * @return An array of Comment objects
**/
router.post("/:postId/comment", auth, commentController.postComment );


/**
 * @api posts/:postId/like - POST
 * This route allows the user to like a post - this 'like 
 * is also stored on the post document
 * @param postId - the unique id of the post to be liked.
 * @return Post object and the Like object as JSON
**/
router.post("/:postId/like", auth, voteController.addLike );

/**
 * @api posts/:postId/dislike -POST 
 * This route allows the user to dislike a post - this 'dislike 
 * is also stored on the post model document
 * @param postId - the unique id of the post to be disliked.
 * @return Post object and the dislike object 
**/
  router.post("/:postId/dislike", auth, voteController.addDisLike);

/**
 * @api GET posts/:postId 
 * This route allows the user to view a singleton post
 * @param postId - the unique id of the post to be disliked.
 * @return the selected Post object  
**/
router.get("/:postId", auth, postController.getPost);

/**
 * @api POST posts/ 
 * This route allows the user to save a post
 * @return The saved Post object 
**/
router.post("/", auth, postController.addPost );

  
  /**
 * @api GET posts/   
 * sends a collection of all posts
 * @return An array of Post objects in JSON
**/
router.get("/", auth, postController.getAllPosts);






module.exports = router;
