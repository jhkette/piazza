const Post = require("../models/Post");

exports.getTopic = async (req, res) => {
  try {
    const topic = req.params.topic;
    const posts = await Post.find({ topic: topic });
    return res.send(posts);
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};

exports.getPost = async (req, res) => {
  try {
    //https://mongoosejs.com/docs/populate.html
    const post = await Post.findById(req.params.postId)
      .populate({ path: "postComments" })
      .populate({ path: "likes" })
      .populate({ path: "dislikes" })
      // I only want to show the user name not the whole object
      // so i have added a second parameter - username
      .populate("userId", "username");
    res.send({ post, isexpired: post.isexpired });
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};

exports.addPost = async (req, res) => {
  console.log(req);
  const postData = new Post({
    title: req.body.title,
    message: req.body.message,
    userId: req.user._id,
    topic: req.body.topic,
  });

  try {
    const postToSave = await postData.save();
    res.send(postToSave);
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    return res.send(posts);
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};
