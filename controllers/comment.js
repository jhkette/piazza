const Comment = require("../models/Comment");
const Post = require("../models/Post");

exports.postComment = async (req, res) => {
  // get post from params
  const post = await Post.findById(req.params.postId);

  if (post.isexpired) {
    //  if virtual post is expires is true you cannot comment
    return res.json({ msg: "This post has expired" });
  }
  const commentData = new Comment({
    // create new comment
    text: req.body.text,
    userId: req.user.id,
    postId: req.params.postId,
  });
  try {
    const commentToSave = await commentData.save(); // save comment
    //  we also need to update the post object with comment
    await post.updateOne({ $push: { postComments: commentToSave._id } });
    return res.send(commentToSave); // send comment
  } catch (err) {
    return res.status(400).send({ message: err }); // if error send error
  }
};
