const mongoose = require('mongoose')
const Schema = mongoose.Schema;
//  Model for a dislike
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