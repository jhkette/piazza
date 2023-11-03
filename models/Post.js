const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Comment = require("./Comment");
const User = require("./User");

const postSchema = mongoose.Schema({
  text: {
    type: String,
    require: true,
    min: 3,
    max: 3000,
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  topic: [
    {
      type: String,
      enum: ["sports", "tech", "politics", "health"],
      min: 3,
      max: 25,
    },
  ],
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  postComments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  votes: [{ type: Schema.Types.ObjectId, ref: "Vote" }],
});

module.exports = mongoose.model("Post", postSchema);
