const express = require("express");
const { handleBlogPost, handleAllBlogs, handleFindBlogById, handleDeleteBlog, handleUserBlogs, handleBlogCommentPost, handleLikeBlogPost, handleGetBlogsFromFollowersAndFollowing } = require("../services/blog");

const blogRouter = express.Router();

blogRouter.post("/post", handleBlogPost)

blogRouter.get("/allBlogs", handleAllBlogs)

blogRouter.get("/:id", handleFindBlogById)

blogRouter.delete("/:id", handleDeleteBlog)

blogRouter.post("/userBlogs", handleUserBlogs)

blogRouter.post("/comment/:id", handleBlogCommentPost)

blogRouter.post("/likePost", handleLikeBlogPost);

blogRouter.post("/getExplorePosts", handleGetBlogsFromFollowersAndFollowing);

module.exports ={
    blogRouter
}