const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const voteSchema = mongoose.Schema({
    value: {
        type: Number, min: -1, max: 1,
        require: true,
    },
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

module.exports = mongoose.model('Vote', voteSchema)