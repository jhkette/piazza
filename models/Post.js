const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;

//  Model for a post
const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 3,
    max: 3000,
  },
  message: {
    type: String,
    required: true,
    min: 3,
    max: 4000,
  },
  // im only storing the userid as opposed to a username - as the userID allows us to populate a username
  userId: { 
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  topic: [
    {
      type: String,
      enum: ["sports", "tech", "politics", "health"], // using enum to ensure it is one of these things
      required: true,
      min: 3,
      max: 25,
    },
  ],
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  expireAt: {
    type: Date,
    immutable: true,
    default: () => moment(Date.now()).add(5, "m").toDate(),
  },
  postComments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
  dislikes: [{ type: Schema.Types.ObjectId, ref: "DisLike" }],
});
// these are 'virtuals' - which are not storeed on mongodb
// but are computed from db values. As they are useful values 
// they are added to result from posts by the statement at bottom -
// postSchema.set('toJSON', { getters: true });

// votescore is total positive votes
postSchema.virtual("votescore").get(function () {
  return this.likes.length - this.dislikes.length;
});
// i've added a readable date
postSchema.virtual("readabledate").get(function () {
  const time = moment(this.createdAt);
  return time.format("MMM D YYYY h:mm A");
});

// A check to see if the post is expired
postSchema.virtual("expireStatus").get(function () {
  const now = Date.now();
  if (now > this.expireAt) {
    return true;
  } else {
    return false;
  }
});
postSchema.set('toJSON', { getters: true });
module.exports = mongoose.model("Post", postSchema);
