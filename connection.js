require('dotenv').config()

const mongoose = require("mongoose");

const connectToDB = ()=>{
    return mongoose.connect(process.env.MONGO_URI);
}

module.exports = {connectToDB};