const Post = require("../models/Post");
const User = require("../models/User");
const xss = require("xss");

/* function that gets an array of post related to topic on route below
 *  GET- piazza/posts/:topic */
exports.getTopic = async (req, res) => {
  try {
    const topic = xss(req.params.topic); // get para,s
    const posts = await Post.find({ topic: topic }); // find posts with topic
    // sort posts by votescore
    const sortedposts = posts.sort((a, b) => {
      return b.votescore - a.votescore;
    });
    return res.send(sortedposts); // send posts
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};

/* function that gets specific post on route below
 *  GET- piazza/posts/:postId */
exports.getPost = async (req, res) => {
  try {
    // wrapping finding post and populating fields in try catch to handle errors
    const post = await Post.findById(xss(req.params.postId))
      //https://mongoosejs.com/docs/populate.html  - populate other related collections
      // so they can be sent alongside post info
      .populate({ path: "postComments" })
      .populate({ path: "likes" })
      .populate({ path: "dislikes" })
      // I only want to show the user name not the whole object
      // so i have added a second parameter - username
      .populate("userId", "username");
    res.send({ post });
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};

/* function that adds post on add post route
 *  POST - piazza/posts/ */
exports.addPost = async (req, res) => {
  // create new post
  const postData = new Post({
    title: xss(req.body.title),
    message: xss(req.body.message),
    userId: req.user.id,
    topic: xss(req.body.topic),
  });

  try {
    const postToSave = await postData.save(); // save post to mongodb
    const user = await User.findById(req.user.id);
    res.status(201).send({ postToSave, username: user.username });
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};

/* function that returns all posts on route below
 *  GET - piazza/posts/ */
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // find all posts and srt by most recent

    return res.send(posts); // send posts
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};

exports.getExpiredPosts = async (req, res) => {
  try {
    const topic = xss(req.params.topic); // get params
    const posts = await Post.find({ topic: topic }); // find posts with topic
    const expired = posts.filter((post) => post.expireStatus == "expired"); // filter out 'live' posts

    return res.send(expired); // send posts
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};
