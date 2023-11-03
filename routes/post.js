const express = require("express");
const Post = require("../models/Post");
const router = express.Router();
const auth = require("../validations/verifyToken");
const Comment = require("../models/Comment");
const User = require("../models/User");

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find();
    return res.send(posts);
  } catch (err) {
    return res.status(400).send({ message: err });
  }
});

router.get("/topic/:topic", auth, async (req, res) => {
  try {
    const topic = req.params.topic;
    const posts = await Post.find({ topic: topic });
    return res.send(posts);
  } catch (err) {
    return res.status(400).send({ message: err });
  }
});

router.get("/:postId", auth, async (req, res) => {
  try {
    //https://mongoosejs.com/docs/populate.html
    const post = await Post.findById(req.params.postId);
    //   .populate({
    //     path: 'comments',

    //   })
    //   .then(post => {
    //     console.log(post)
    //     return res.send(post);
    //  });

    //  console.log(post)
    //https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
    const allcomments = await Promise.all(
      post.comments.map(async (comment) => {
        const foundComment = await Comment.findById(comment._id).exec();
        return foundComment;
      })
    );

    // const foundUser = await User.findById(post.userId);
    res.send({post, allcomments});
  } catch (err) {
    return res.status(400).send({ message: err });
  }
});

router.post("/", auth, async (req, res) => {
  const postData = new Post({
    text: req.body.text,
    userId: req.user._id,
    topic: req.body.topic,
  });

  try {
    const postToSave = await postData.save();
    // add to relevant topics
    // const topic = await Topic.findById(req.body.topicId).exec();
    // await topic.updateOne({ $push: { posts: postToSave._id} })

    res.send(postToSave);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
