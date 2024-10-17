const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    blogs: [
        {
            type: mongoose.Types.ObjectId,
            ref: "BLOG",
            required: true
        }
    ],
    likedPosts: [
        {
            type: mongoose.Types.ObjectId,
            ref: "BLOG",
            required: true
        }
    ]
})

const User = mongoose.model("User", UserSchema);

module.exports = {
    User
}