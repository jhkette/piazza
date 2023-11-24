const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User")
const xss = require("xss");


/* This functions still runs on the posts route
I have simply split files to make it easier to read  */

//this function posts a comment -
// associated with a post
// on route POST /posts/comments/:postId
exports.postComment = async (req, res) => {
  // get post from params
  const post = await Post.findById(xss(req.params.postId));

  if (post.expireStatus) {
    //  if virtual post is expires is true you cannot comment
    return res.json({ msg: "This post has expired" });
  }
  const commentData = new Comment({
    // create new comment
    text: xss(req.body.text),
    userId: req.user.id,
    postId: xss(req.params.postId),
  });
  try {
    const commentToSave = await commentData.save(); // save comment
    //  we also need to update the post object with comment
    await post.updateOne({ $push: { postComments: commentToSave._id } });
    
    const user = await User.findById(xss(req.user.id)); // get user
    const timeLeft = `${Math.floor((post.expireAt - Date.now())/1000)} seconds left`;
    return res.status(201).send({comment:commentToSave, post, user: user.username, timeLeft}); // send comment
  } catch (err) {
    return res.status(400).send({ message: err }); // if error send error
  }
};