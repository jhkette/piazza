const express = require("express");
const Post = require("../models/Post");
const router = express.Router();
const auth = require("../validations/verifyToken");


router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({createdAt: -1});
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
      .populate("userId", "username")

    // console.log(foundUser)
    // const totalVotes = likes.length - dislikes.length;
    res.send({ post });
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
    return res.status(400).send({ message: err });
  }
});



module.exports = router;
