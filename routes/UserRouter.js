const express = require("express");
const { handleUserSignup, handleUserSignin, handleGetAllUsers } = require("../services/user");

const userRouter = express.Router();

userRouter.post("/signup", handleUserSignup);
userRouter.post("/signin", handleUserSignin)
userRouter.get("/getAllUsers", handleGetAllUsers)

module.exports = {
    userRouter
};
