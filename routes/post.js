const express = require("express");
const Post = require("../models/Post");
const router = express.Router();
const auth = require("../validations/verifyToken");
const Comment = require("../models/Comment");
const User = require("../models/User");
const Vote = require("../models/Vote");

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
    const post = await Post.findById(req.params.postId)
      .populate({path: "postComments"})
    const foundUser = await User.findById(post.userId);
    res.send({post, foundUser});
  } catch (err) {
    return res.status(400).send({ message: err });
  }
});

router.post("/", auth, async (req, res) => {
  const topics =["politics", "health", "tech", "sports"]
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
    return res.send(err);
  }
});

router.post("/:postId/vote", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
    .populate({path: "votes"})
    // console.log(post.votes[0].userId, req.user._id)

     const alreadyVoted = post.votes.filter(p => p.userId.toString() === req.user._id);
    if(alreadyVoted){
      return res.send({message: "You have already voted"})
    }
    const voteData = new Vote({
      value: req.body.value,
      userId: req.user._id,
      postId: req.params.postId,
    });
    const voteToSave = await voteData.save();
    const amendedPost = await post.updateOne({ $push: { votes: voteToSave._id} })
    // add to relevant topics
    // const topic = await Topic.findById(req.body.topicId).exec();
    // await topic.updateOne({ $push: { posts: postToSave._id} })

    res.send({post, voteToSave});
  } catch (err) {
    return res.send(err);
  }
});

module.exports = router;
