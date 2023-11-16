const mongoose = require('mongoose')
const Schema = mongoose.Schema;
// dislike model
const dislikeSchema = mongoose.Schema({
   
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        require: true
    },
})

module.exports = mongoose.model('DisLike', dislikeSchema )