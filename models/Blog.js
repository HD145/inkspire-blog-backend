const { default: mongoose } = require("mongoose");
const { CommentSchema } = require("./Comments");

const BlogSchema = new mongoose.Schema({
    title:{
        type: String,
        require: true
    },
    description:{
        type: String,
    },
    username:{
        type:String, 
        require:true
    },
    postedAt: {
        type: Date,
        default: Date.now
    },
    comments:[
        CommentSchema
    ],
    likedBy:[
        {
            type:String
        }
    ]
})

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = {
    Blog
}