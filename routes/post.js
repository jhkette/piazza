const express = require("express");
const Post = require("../models/Post");
const router = express.Router();
const auth = require("../validations/verifyToken");


const Like = require("../models/Like");
const DisLike = require("../models/Dislike");

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

      .populate({ path: "postComments" })
      .populate({ path: "likes" })
      .populate({ path: "dislikes" })
      .populate("userId")

    const { likes, dislikes, userId } = post;
    const totalVotes = likes.length - dislikes.length
    res.send({ post, votes: totalVotes, username:userId.username });
  } catch (err) {
    return res.status(400).send({ message: err });
  }
});

router.post("/", auth, async (req, res) => {
  const postData = new Post({
    title: req.body.title,
    message: req.body.message,
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

router.post("/:postId/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate({
      path: "likes",
    });
    // console.log(post.votes[0].userId, req.user._id)
    console.log(post);

    const alreadyLiked = post.likes.filter(
      (p) => p.userId.toString() === req.user._id
    );
    console.log(alreadyLiked)
    if (alreadyLiked.length >= 1) {
      return res.send({ message: "You have already like this Post" });
    }
    const likeData = new Like({
      userId: req.user._id,
      postId: req.params.postId,
    });
    // maybe add .save()
    const likeToSave = await likeData.save();
    const amendedPost = await post.updateOne({
      $push: { likes: likeToSave._id },
    })
    // add to relevant topics
    // const topic = await Topic.findById(req.body.topicId).exec();
    // await topic.updateOne({ $push: { posts: postToSave._id} })

    res.send({ post, likeToSave });
  } catch (err) {
    return res.send(err);
  }
});

router.post("/:postId/dislike", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
    .populate({
      path: "dislikes",
    });
    const alreadydisLiked = post.dislikes.filter(
      (p) => p.userId.toString() === req.user._id
    );
    if (alreadydisLiked.length > 0) {
      return res.send({ message: "You have already disliked this Post" });
    }
    const dislikeData = new DisLike({
      userId: req.user._id,
      postId: req.params.postId,
    });
    const dislikeToSave = await dislikeData.save();
    const amendedPost = await post.updateOne({
      $push: { dislikes: dislikeToSave._id },
    })
    res.send({ post, dislikeToSave });
  } catch (err) {
    return res.send(err);
  }
});

module.exports = router;
