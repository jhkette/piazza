const mongoose = require('mongoose')
const Schema = mongoose.Schema;
// dislike model
const dislikeSchema = mongoose.Schema({
   
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
})

module.exports = mongoose.model('DisLike', dislikeSchema )