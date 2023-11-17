const express = require("express");
const Post = require("../models/Post");
const router = express.Router();
const auth = require("../validations/verifyToken");
const postController = require("../controllers/post")



/**
 * @api {post}/  - GET
 * get all posts
 * @return An array of Post objects in JSON
**/
router.get("/", auth, postController.getAllPosts);

/**
 * @api {post/topic/:topic This route allows the user to view all topics a post - this 'dislike 
 * is also stored on the post document
 * @param topic - the topic to be viewed
 * @return An array of Post objects in JSON
**/
router.get("/topic/:topic", auth, postController.getTopic);

/**
 * @api post/:postId/dislike - GET 
 * This route allows the user to dislike a post - this 'dislike 
 * is also stored on the post document
 * @param postId - the unique id of the post to be disliked.
 * @return Post object and the dislike object as JSON
**/
router.get("/:postId", auth, postController.getPost);

/**
 * @api post/ - POST
 * This route allows the user to save a post
 * @param postId - the unique id of the post to be disliked.
 * @return Post object and the dislike object as JSON
**/
router.post("/", auth, postController.addPost );



module.exports = router;
