const mongoose = require('mongoose')

const voteSchema = mongoose.Schema({
    value: {
        type: Number, min: -1, max: 1,
        require: true,
    },
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

module.exports = mongoose.model('Vote', voteSchema)