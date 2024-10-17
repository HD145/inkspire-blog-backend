const mongoose = require("mongoose")

const CommentSchema = new mongoose.Schema({
    text:{
        type: String,
    }, 
    author:{
        type:String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = {
    CommentSchema
}