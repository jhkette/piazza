const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const likeSchema = mongoose.Schema({
   
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

module.exports = mongoose.model('Like', likeSchema)