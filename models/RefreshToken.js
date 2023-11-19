const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// like model
const refreshTokenSchema = mongoose.Schema({

    refreshToken:{
        type: String,
        require: true,
        min: 10,
        max: 600,
    },
   
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }
})

module.exports = mongoose.model('RefreshToken', refreshTokenSchema)