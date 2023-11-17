const Post = require("../models/Post");
const Like = require("../models/Like");
const DisLike = require("../models/Dislike");

exports.addLike = async (req, res) => {
    try {
      // post findbyId - populate with likes
      const post = await Post.findById(req.params.postId).populate({
        path: "likes",
      });
      // check if virtual 'isepxired' is truthy
      if(post.isexpired){
        return res.json({message: "This post has expired"})
      }
        // check if user has already liked post - it doesn't make sense to dislike something twice
      const alreadyLiked = post.likes.filter(
        (p) => p.userId.toString() === req.user._id // filter array for matching user id
      );
        //  if the filter array alreadydisLiked is more than one they must have liked post
      if (alreadyLiked.length >= 1) {
        return res.send({ message: "You have already like this Post" });
      }
      // create new like object
      const likeData = new Like({
        userId: req.user._id,
        postId: req.params.postId,
      });
      // save like
      const likeToSave = await likeData.save();
      await post.updateOne({
        $push: { likes: likeToSave._id },
      });
      // sends post, likeTosave
      res.send({ post, likeToSave });
    } catch (err) {
      return res.status(400).send({ message: err });
    }
}

exports.addDisLike = async (req, res) => {
    try {
      // find the post and populate it with the existing dislikes
      const post = await Post.findById(req.params.postId).populate({
        path: "dislikes",
      });
      // check if virtual 'isepxired' is truthy
      if(post.isexpired){
        return res.json({message: "This post has expired"}) // send message if true
      }
      // check if user has already disliked post - it doesn't make sense to dislike something twice
      const alreadydisLiked = post.dislikes.filter(
        (p) => p.userId.toString() === req.user._id // filter array for matching user id
      );
      //  if the filter array alreadydisLiked is more than one they must have disliked post
      if (alreadydisLiked.length > 0) {
        return res.send({ message: "You have already disliked this Post" });
      }
      const dislikeData = new DisLike({ // create new dislike object
        userId: req.user._id,
        postId: req.params.postId,
      });
      const dislikeToSave = await dislikeData.save(); // save dislke
      await post.updateOne({  // push new dislike to array in database
        $push: { dislikes: dislikeToSave._id },
      });
      res.send({ post, dislikeToSave }); // send post and disliketosave
    } catch (err) {
      return res.status(400).send({ message: err }); // send error if error thrown
    }
  }