require('dotenv').config()

const cors = require("cors")
const express = require("express");
const { connectToDB } = require("./connection");
const { userRouter } = require("./routes/UserRouter");
const { blogRouter } = require("./routes/BlogRouter");

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true // Allow cookies to be sent across origins
}));

app.use(express.json());

app.use(express.urlencoded({extended:false}))

connectToDB().then(()=>console.log("Connected to Database"));

app.use("/home",(req, res)=>{
    return res.send("Hello from Blog Backend.")
})
app.use("/user", userRouter)
app.use("/blog", blogRouter)

app.listen(process.env.PORT, ()=>console.log(`Server is running on PORT : ${process.env.PORT}`));