const express = require("express");
const { handleBlogPost, handleAllBlogs, handleFindBlogById, handleDeleteBlog, handleUserBlogs, handleMail, handleBlogCommentPost, handleLikeBlogPost } = require("../services/blog");

const blogRouter = express.Router();

blogRouter.post("/post", handleBlogPost)

blogRouter.get("/allBlogs", handleAllBlogs)

blogRouter.get("/:id", handleFindBlogById)

blogRouter.delete("/:id", handleDeleteBlog)

blogRouter.post("/userBlogs", handleUserBlogs)

blogRouter.post("/sendMail", handleMail)

blogRouter.post("/comment/:id", handleBlogCommentPost)

blogRouter.post("/likePost", handleLikeBlogPost)

module.exports ={
    blogRouter
}