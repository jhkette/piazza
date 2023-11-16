const express = require("express");
const Comment = require("../models/Comment");
const router = express.Router();
const auth = require("../validations/verifyToken");
const Post = require("../models/Post");


/**
 * @api {comment}/:postId This route allows the user to view all topics a post - this 'dislike 
 * is also stored on the post document
 * @param topic - the topic to be viewed
 * @return An array of Post objects in JSON
**/
  
router.post("/:postId", auth, async (req, res) => {
  // get post from params
  const post = await Post.findById(req.params.postId);
  if(post.isexpired){ //  if virtual post is expires is true you cannot comment
    return res.json({msg: "This post has expired"})
  }
  const commentData = new Comment({ // create new comment
    text: req.body.text, 
    userId: req.user._id,
    postId: req.params.postId
  });
  try {
    const commentToSave = await commentData.save(); // save comment
    //  we also need to update the post object with comment
    await post.updateOne({ $push: { postComments: commentToSave._id} }) 
    res.send(commentToSave); // send comment 
  } catch (err) {
    return res.status(400).send({ message: err }); // if error send error
  }
});

module.exports = router;