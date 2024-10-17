const { handleSendMail } = require("../common/email-config");
const { Blog } = require("../models/Blog");
const { User } = require("../models/User");
const otpGenerator = require("otp-generator")


const handleBlogPost = async (req, res) => {
    try {
        const { title, description, username } = req.body;

        if (!title) {
            return res.status(400).send("Title of the post is required.");
        }

        const userData = await User.findOne({ username });

        const blog = new Blog({
            title, description, username
        })

        const savedBlog = await blog.save();

        userData.blogs.push(savedBlog._id);

        userData.save();

        return res.status(200).send("Transaction completed successfully.")

    } catch (error) {
        console.log(error);
        return res.status(500).send("Server not found. Please try again.")
    }
}

const handleAllBlogs = async(req, res) => {
    try{
        const allBlogs = await Blog.find({});        
        return res.status(200).send(allBlogs)
    }catch(error){
        console.log(error);
        return res.status(500).send("Server not found. Please try again.")
    }
}

const handleFindBlogById = async(req, res)=>{
    try{
        const id = req.params.id;
        const blog = await Blog.findById(id);
        if(!blog){
            return res.status(200).send("No blog with this id exists.")
        }
        return res.status(200).send(blog)
    }catch(error){
        console.log(error);
        return res.status(500).send("Server not found. Please try again.")
    }
}

const handleDeleteBlog = async(req, res) => {
    try{
        const id = req.params.id;

        const deletedPost = await Blog.findByIdAndDelete(id);

        const user = await User.findOne({username : deletedPost?.username})
        const userBlogs = user.blogs;
        
        const updatedBlogs = userBlogs.filter((item)=> item.valueOf() != id);
        
        user.blogs = updatedBlogs;
        console.log(user);

        user.save();

        return res.status(200).send("Transaction completed successfully");

    }catch(error){
        console.log(error);
        return res.status(500).send("Server not found. Please try again.")
    }
}

const handleUserBlogs = async(req, res)=>{
    try{
        const {username} = req.body;

        const user = await User.findOne({username});
        const allBlogs = await Blog.find({});
        
        let userBlogs = allBlogs.filter((blog) => user.blogs.some(blogId => blogId.valueOf() === blog._id.valueOf()));
        return res.status(200).send(userBlogs)

    }catch(error){
        console.log(error);
        return res.status(500).send("Server not found. Please try again.")
    }
}

const handleMail = async(req, res)=>{

    try{
        const {email} = req.body;
        
        const otp = await otpGenerator.generate(6, {lowerCaseAlphabets:false, upperCaseAlphabets:false, specialChars:false});
        console.log(otp);
        await handleSendMail(email, otp);
        
        return res.status(200).send(`One Time Password : ${otp}`)
    }catch(error){
        console.log(error);
        return res.status(500).send("Server not found. Please try again.")
    }
}

const handleBlogCommentPost = async(req, res) => {
    try{
        const blogId = req.params.id;
        console.log(blogId);
        
        const {text, userId} = req.body;

        const blog = await Blog.findById(blogId);

        blog.comments.push({text, author:userId});
        await blog.save();

        return res.status(200).send("Successfully Posted.")
    }catch(error){
        console.log(error);
        return res.status(500).send("Server not found. Please try again.")
    }
}

const handleLikeBlogPost = async(req, res)=>{
    try{
        const {userId, blogId} = req.body;

        const user = await User.findOne({username:userId});
        const blog = await Blog.findById(blogId);

        const hasLiked = blog.likedBy.includes(userId);        
        const likedPostIndex = user.likedPosts.indexOf(blogId);

        if(hasLiked){
            blog.likedBy = blog.likedBy.filter(item => item !== userId);
            if (likedPostIndex !== -1) {
                user.likedPosts.splice(likedPostIndex, 1);
            }

            await blog.save();
            await user.save();
        }else{
            blog.likedBy.push(userId);
            user.likedPosts.push(blogId);

            await blog.save();
            await user.save();
        }

        return res.status(200).send("Transaction completed successfully");

    }catch(error){
        console.log(error);
        return res.status(500).send("Server not found. Please try again.")
    }
}

module.exports = {
    handleBlogPost, handleAllBlogs, handleFindBlogById, handleDeleteBlog, handleUserBlogs, handleMail, handleBlogCommentPost, handleLikeBlogPost
}