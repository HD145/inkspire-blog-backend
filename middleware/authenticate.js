require('dotenv').config()
const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const token = req.cookies.token; 

    if (!token) {
        return res.status(401).send("Access denied. No token provided.");
    }
    try {
        const secretKey = process.env.SECRET_KEY; 
        const decoded = jwt.verify(token, secretKey); 
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).send("Invalid or expired token.");
    }
};

module.exports = authenticateUser;
