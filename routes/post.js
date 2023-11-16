const express = require("express");
const Post = require("../models/Post");
const router = express.Router();
const auth = require("../validations/verifyToken");



/**
 * @api {post}/  - GET
 * get all posts
 * @return An array of Post objects in JSON
**/
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({createdAt: -1});
    return res.send(posts);
  } catch (err) {
    return res.status(400).send({ message: err });
  }
});

/**
 * @api {post}/topic/:topic This route allows the user to view all topics a post - this 'dislike 
 * is also stored on the post document
 * @param topic - the topic to be viewed
 * @return An array of Post objects in JSON
**/
  
router.get("/topic/:topic", auth, async (req, res) => {
  try {
    const topic = req.params.topic;
    const posts = await Post.find({ topic: topic });
    return res.send(posts);
  } catch (err) {
    return res.status(400).send({ message: err });
  }
});

/**
 * @api {post}/:postId/dislike - GET 
 * This route allows the user to dislike a post - this 'dislike 
 * is also stored on the post document
 * @param postId - the unique id of the post to be disliked.
 * @return Post object and the dislike object as JSON
**/
  

router.get("/:postId", auth, async (req, res) => {
  try {
    //https://mongoosejs.com/docs/populate.html
    const post = await Post.findById(req.params.postId)
      .populate({ path: "postComments" }) // populate 
      .populate({ path: "likes" })
      .populate({ path: "dislikes" })
      // I only want to show the user name not the whole user object
      // so i have added a second parameter - username
      .populate("userId", "username")
    res.send({post, isexpired: post.isexpired});
  } catch (err) {
    return res.status(400).send({ message: err });
  }
});

/**
 * @api {post}/ - GET
 * This route allows the user to save a post
 * @param postId - the unique id of the post to be disliked.
 * @return Post object and the dislike object as JSON
**/
  
router.post("/", auth, async (req, res) => {
  // create new post object
  const postData = new Post({
    title: req.body.title,
    message: req.body.message,
    userId: req.user._id,
    topic: req.body.topic,
  });

  try {
    // save post to database
    const postToSave = await postData.save();
    // send post 
    res.send(postToSave);
  } catch (err) {
    return res.status(400).send({ message: err }); // if error send error message
  }
});



module.exports = router;
