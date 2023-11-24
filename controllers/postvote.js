const Post = require("../models/Post");
const Like = require("../models/Like");
const DisLike = require("../models/Dislike");
const User = require("../models/User")
const xss = require("xss");

/* These functions still run on the posts route
I have simply split files to make it easier to read  */

/* function that adds a like to a post on route below
*  POST - piazza/posts/:postId/like */
exports.addLike = async (req, res) => {
    try {
      const postParams = xss(req.params.postId)
      
      // post findbyId - populate with likes
      const post = await Post.findById(postParams).populate({
        path: "likes",
      });
      
      // check if virtual 'isepxired' is truthy
      if(post.expireStatus){
        return res.json({message: "This post has expired"})
      }
        // check if user has already liked post - it doesn't make sense to like something twice
      const alreadyLiked = post.likes.filter(
        (p) => p.userId.toString() === req.user.id // filter array for matching user id
      );
        //  if the filter array alreadydisLiked is more than one they must have liked post
      if (alreadyLiked.length >= 1) {
        return res.send({ message: "You have already like this Post" });
      }
      // create new like object
      const likeData = new Like({
        userId: req.user.id,
        postId: postParams,
      });
      // save like
      const likeToSave = await likeData.save();
      await post.updateOne({
        $push: { likes: likeToSave._id },
      });
      const user = await User.findById(xss(req.user.id)); // get user
      const timeLeft = `${Math.floor((post.expireAt - Date.now())/1000)} seconds left`;
      // sends post, likeTosave
      return res.status(201).send({ post, likeToSave, user: user.username, timeLeft });
    } catch (err) {
      return res.status(400).send({ message: err });
    }
}
/* function that adds a dislike to a post on route below
*  POST - piazza/:postId/dislike */
exports.addDisLike = async (req, res) => {
  try {
    const postParams = xss(req.params.postId)
    
    // post findbyId - populate with likes
    const post = await Post.findById(postParams).populate({
      path: "dislikes",
    });
    
    // check if virtual 'isepxired' is truthy
    if(post.expireStatus){
      return res.json({message: "This post has expired"})
    }
      // check if user has already liked post - it doesn't make sense to like something twice
    const alreadyDisLiked = post.dislikes.filter(
      (p) => p.userId.toString() === req.user.id // filter array for matching user id
    );
      //  if the filter array alreadydisLiked is more than one they must have liked post
    if (alreadyDisLiked.length >= 1) {
      return res.send({ message: "You have already disliked this Post" });
    }
    // create new like object
    const dislikeData = new DisLike({
      userId: req.user.id,
      postId: postParams,
    });
    // save like
    const dislikeToSave = await dislikeData.save();
    await post.updateOne({
      $push: { dislikes: dislikeToSave._id },
    });
    const timeLeft = `${Math.floor((post.expireAt - Date.now())/1000)} seconds left`;
    const user = await User.findById(xss(req.user.id)); // get user
    // sends post, likeTosave, username
    return res.status(201).send({ post, dislike: dislikeToSave, username: user.username, timeLeft });
    } catch (err) {
      return res.status(400).send({ message: err }); // send error if error thrown
    }
  }