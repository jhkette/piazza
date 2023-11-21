const Post = require("../models/Post");

const xss = require("xss");

/* function that gets an array of post related to topic on route below
*  GET- piazza/posts/:topic */
exports.getTopic = async (req, res) => {
  try {
    const topic = xss(req.params.topic); // get para,s
    const posts = await Post.find({ topic: topic }); // find posts with topic
    return res.send(posts); // send posts
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};

/* function that gets specific post on route below
*  GET- piazza/posts/:postId */
exports.getPost = async (req, res) => {
  try { // wrapping finding post and populating fields in try catch to handle errors
    const post = await Post.findById(xss(req.params.postId))
    //https://mongoosejs.com/docs/populate.html  - populate other related collections
    // so they can be sent alongside post info
      .populate({ path: "postComments" })  
      .populate({ path: "likes" })
      .populate({ path: "dislikes" })
      // I only want to show the user name not the whole object
      // so i have added a second parameter - username
      .populate("userId", "username");
    res.send({ post});
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
    userId: xss(req.user.id),
    topic: xss(req.body.topic),
  });

  try {
    const postToSave = await postData.save(); // save post to mongodb
    res.send(postToSave);
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};

/* function that returns all posts on route below
*  GET - piazza/posts/ */
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }) // find all posts and srt by most recent
   
    return res.send(posts); // send posts
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};


