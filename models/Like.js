const mongoose = require('mongoose')
const Schema = mongoose.Schema;
// like model
const likeSchema = mongoose.Schema({
   
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

module.exports = mongoose.model('Like', likeSchema)