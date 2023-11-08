const express = require("express");
const Comment = require("../models/Comment");
const router = express.Router();
const auth = require("../validations/verifyToken");
const Post = require("../models/Post");


router.get("/", auth, async (req, res) => {
  try {
 
    const comments = await Comment.find();
    return res.send(comments);
  } catch (err) {
    return res.status(400).send({ message: err });
  }
});

router.post("/:postId", auth, async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if(post.isexpired){
    return res.json({msg: "This post has expired"})
  }
  const commentData = new Comment({
    text: req.body.text,
    userId: req.user._id,
    postId: req.params.postId
   
  });

  try {
    const commentToSave = await commentData.save();
    // add to relevant topics
    
    await post.updateOne({ $push: { postComments: commentToSave._id} })
    res.send(commentToSave);
  } catch (err) {
    return res.status(400).send({ message: err });
  }
});

module.exports = router;