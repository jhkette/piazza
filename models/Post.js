const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;

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
      immutable: true,
      min: 3,
      max: 25,
    },
  ],
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  expired: {
    type: Date,
    immutable: true,
    default: () => moment(Date.now()).add(5, "m").toDate(),
  },

  postComments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
  dislikes: [{ type: Schema.Types.ObjectId, ref: "DisLike" }],
});

postSchema.virtual("votetotal").get(function () {
  return this.likes.length - this.dislikes.length;
});
postSchema.virtual("readabledate").get(function () {
  const time = moment(this.createdAt);
  return time.format("MMM D YYYY h:mm A");
});

module.exports = mongoose.model("Post", postSchema);

// https://mongoosejs.com/docs/api/schemadateoptions.html#SchemaDateOptions.prototype.expires
