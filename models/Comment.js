const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema({
  
    text:{
        type: String,
        required: true,
        min: 3,
        max: 3000,
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      createdAt:{
        type: Date,
        immutable: true,
        default: () => Date.now()
      },
      postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
      }
})

module.exports = mongoose.model('Comment', commentSchema)