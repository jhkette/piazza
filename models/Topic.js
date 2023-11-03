const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const topicSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
    min: 3,
    max: 120,
  },
  posts: [{type: Schema.Types.ObjectId, ref: "Post"}],
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt:{
    type: Date,
    immutable: true,
    default: () => Date.now()
  }
});


module.exports = mongoose.model('topics', topicSchema)
// cart: {
//     items: [
//       {
//         productId: {
//           type: Schema.Types.ObjectId,
//           ref: 'Product',
//           required: true
//         },
//         quantity: { type: Number, required: true }
//       }
//     ]
//   }
