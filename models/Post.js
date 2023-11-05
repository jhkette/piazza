const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Comment = require("./Comment");
const User = require("./User");
const Like = require("./Like")
const DisLike = require("./Dislike")

const postSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
    min: 3,
    max: 3000,
  },
  message: {
    type: String,
    require: true,
    min: 3,
    max: 4000,
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
  likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
  dislikes: [{ type: Schema.Types.ObjectId, ref: "DisLike" }]
});

// postSchema.virtual.countVotes = () => {
//   this.populate({

//   })
//   // return this.votes?.reduce((prev, curr) => prev + (curr.value || 0), 0);
// }

module.exports = mongoose.model("Post", postSchema);

// https://mongoosejs.com/docs/api/schemadateoptions.html#SchemaDateOptions.prototype.expires
