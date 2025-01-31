const express = require("express");
const { handleUserSignup, handleUserSignin, handleGetAllUsers, handleGetUserData, handleFollowUser, handleUnfollowUser, handleUserLogout, handleGetDataUser, handleMail, handleVerifyOtp, handleUpdatePassword } = require("../services/user");
const authenticateUser = require("../middleware/authenticate");

const userRouter = express.Router();

userRouter.post("/signup", handleUserSignup);
userRouter.post("/signin", handleUserSignin);
userRouter.post("/getUserData", handleGetUserData);
userRouter.get("/getAllUsers", handleGetAllUsers);
userRouter.post("/followUser",authenticateUser, handleFollowUser);
userRouter.post("/unfollowUser",authenticateUser, handleUnfollowUser);
userRouter.post("/logout", handleUserLogout);
userRouter.get('/data', authenticateUser, handleGetDataUser);
userRouter.post("/sendMail", handleMail);
userRouter.post("/verifyOtp", handleVerifyOtp);
userRouter.post("/updatePassword", handleUpdatePassword);

module.exports = {
    userRouter
};