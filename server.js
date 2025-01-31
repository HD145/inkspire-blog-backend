require('dotenv').config()

const cors = require("cors")
const express = require("express");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { connectToDB } = require("./connection");
const { userRouter } = require("./routes/UserRouter");
const { blogRouter } = require("./routes/BlogRouter");
const authenticateUser = require('./middleware/authenticate');
const passport = require('./common/google-config'); 
const { oAuthRouter } = require('./routes/google-oauth');

const app = express();

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, 
        secure: false, 
        sameSite: 'none', 
    },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(
    cors({
        origin: process.env.FRONTEND_URL, 
        credentials: true, 
    })
);

app.use(session({
    secret: process.env.SECRET_KEY, 
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false, 
        sameSite: 'none', 
    },
}));


app.use(express.json());
app.use(cookieParser()); 

app.use(express.urlencoded({extended:false}))

connectToDB().then(()=>console.log("Connected to Database"));

app.use("/", oAuthRouter);
app.use("/user", userRouter)
app.use("/blog", authenticateUser, blogRouter)

app.listen(process.env.PORT, ()=>console.log(`Server is running on PORT : ${process.env.PORT}`));