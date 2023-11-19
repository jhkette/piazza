const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// refreshToken model
const refreshTokenSchema = mongoose.Schema({

    refreshToken:{
        type: String,
        required: true,
        min: 10,
        max: 600,
    },
   
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('RefreshToken', refreshTokenSchema)